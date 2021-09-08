<template>
  <AppLayout :app-settings="settings" :user="user" :routes="routes">
    <img slot="brandA" src="/brand.svg" width="160" height="28" />
    <img slot="brandB" src="/openlab.svg" width="110" height="28" />
    <router-link slot="brandC" :to="atriumRoute">
      <img slot="brandC" src="/square-brand.svg" width="64" height="64" />
    </router-link>
    <div slot="main" class="brandedMain">
      <slot name="main" />
      <PageFooter />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'

import {
  mapApiState,
  AppLayout,
  AppRoute,
  getDefaultRoutes,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import PageFooter from './PageFooter.vue'
import { ConferenceConfig } from '@openlab/deconf-shared'
import { Location } from 'vue-router'

export default Vue.extend({
  components: { AppLayout, PageFooter },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    settings(): ConferenceConfig | null {
      return this.schedule?.settings ?? null
    },
    routes(): AppRoute[] {
      if (!this.settings) return []

      return getDefaultRoutes(
        this.user,
        this.settings,
        (key) => this.$t(key) as string
      )
    },
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>

<style lang="scss">
.brandedMain {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}
.brandedMain-slot {
  flex: 1;
}
</style>
