<template>
  <div id="app">
    <ApiError v-if="apiState === 'error'" :home-route="homeRoute">
      <PageFooter slot="footer" />
    </ApiError>
    <router-view v-else-if="apiState === 'ready'" />
    <AppLoading v-else />
    <DevControl :dev-plugin="$dev" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ApiError,
  ApiState,
  AppLoading,
  DevControl,
  lib,
} from '@openlab/deconf-ui-toolkit'
import { ConfigSettings } from '@openlab/deconf-shared'
import { Location } from 'vue-router'

import PageFooter from './components/PageFooter.vue'
import { TOKEN_STORAGE_KEY } from './lib/module'

interface Data {
  timerId: null | number
}

export default Vue.extend({
  components: { ApiError, AppLoading, DevControl, PageFooter },
  data(): Data {
    return { timerId: null }
  },
  computed: {
    apiState(): ApiState {
      return this.$store.state.api.apiState
    },
    settings(): ConfigSettings {
      return this.$store.getters['api/settings']
    },
    homeRoute(): Location {
      return { name: lib.Routes.Atrium }
    },
  },
  async mounted(): Promise<void> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)

    this.$temporal.setup()

    if (token) {
      await this.$store.dispatch('api/authenticate', token)
    } else {
      await this.$store.dispatch('api/fetchData')
    }

    // Listen for site-visitors and update vuex
    this.$io.socket.on('site-visitors', (count: number) => {
      this.$store.commit('metrics/siteVisitors', count)
    })

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
</style>
