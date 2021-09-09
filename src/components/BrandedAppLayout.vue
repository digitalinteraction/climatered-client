<template>
  <AppLayout :app-settings="settings" :user="user" :routes="routes">
    <BrandA slot="brandA" />
    <BrandB slot="brandB" />
    <LanguageControl slot="languageControl" />
    <router-link slot="brandC" :to="atriumRoute">
      <BrandC slot="brandC" />
    </router-link>
    <div slot="main" class="brandedMain">
      <slot />
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

import BrandA from '../branding/BrandA.vue'
import BrandB from '../branding/BrandB.vue'
import BrandC from '../branding/BrandC.vue'
import LanguageControl from '../components/LanguageControl.vue'

export default Vue.extend({
  components: {
    AppLayout,
    PageFooter,
    BrandA,
    BrandB,
    BrandC,
    LanguageControl,
  },
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
