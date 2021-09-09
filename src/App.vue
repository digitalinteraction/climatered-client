<template>
  <div id="app">
    <ApiError v-if="apiState === 'error'" :home-route="homeRoute">
      <BrandA slot="brand" />
      <PageFooter slot="footer" />
    </ApiError>
    <router-view v-else-if="apiState === 'ready'" />
    <AppLoading v-else />
    <DevControl :dev-plugin="$dev" :force-enable="isDev" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ApiError,
  AppLoading,
  DevControl,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { ConferenceConfig } from '@openlab/deconf-shared'
import { Location } from 'vue-router'

import PageFooter from './components/PageFooter.vue'
import { StorageKey } from './lib/module'
import BrandA from './branding/BrandA.vue'
import { setLocale } from './i18n/module'

interface Data {
  timerId: null | number
}

export default Vue.extend({
  components: { ApiError, AppLoading, DevControl, PageFooter, BrandA },
  data(): Data {
    return { timerId: null }
  },
  computed: {
    ...mapApiState('api', ['apiState', 'schedule', 'user']),
    settings(): ConferenceConfig | null {
      return this.schedule?.settings ?? null
    },
    homeRoute(): Location {
      return { name: Routes.Atrium }
    },
    isDev(): boolean {
      return process.env.NODE_ENV === 'development'
    },
  },
  async mounted(): Promise<void> {
    const token = localStorage.getItem(StorageKey.AuthToken)

    this.$temporal.setup()

    // Listen for site-visitors and update vuex
    this.$io.socket.on('site-visitors', (count: number) => {
      this.$store.commit('metrics/siteVisitors', count)
    })

    if (token) {
      await this.$store.dispatch('api/authenticate', token)
      // Vue.nextTick(() => {
      if (this.user) setLocale(this.user.user_lang)
      // })
    } else {
      await this.$store.dispatch('api/fetchData')
    }

    // TODO: check for allow-listed routes or go to /atrium

    this.timerId = setInterval(
      () => this.$store.dispatch('api/fetchData'),
      this.randomTick()
    )
  },
  destroyed(): void {
    this.$temporal.teardown()
    this.$io.teardown()

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  },
  methods: {
    randomTick(): number {
      return Math.round((3 + Math.random() * 4) * 60 * 1000)
    },
  },
})
</script>

<style lang="scss">
@import '~@openlab/deconf-ui-toolkit/dist/theme.scss';

// TODO: add to deconf-ui-toolkit
@import '~bulma/sass/elements/box.sass';

.button .icon:first-child:not(:last-child) {
  margin-left: unset;
  margin-right: unset;
  margin-inline-start: calc(-0.75em - 1px);
  margin-inline-end: 0.375em;
}
</style>
