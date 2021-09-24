<template>
  <AppLayout
    :app-settings="settings"
    :user="user"
    :routes="routes"
    class="IfrcAppLayout"
  >
    <BrandA slot="brandA" />
    <!-- <BrandB slot="brandB" /> -->
    <LanguageControl slot="languageControl" />
    <router-link slot="brandC" :to="atriumRoute">
      <BrandC />
    </router-link>
    <div slot="main" class="IfrcAppLayout-main">
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
// import BrandB from '../branding/BrandB.vue'
import BrandC from '../branding/BrandC.vue'
import LanguageControl from '../components/LanguageControl.vue'

import AtriumIcon from '../icons/AtriumIcon.vue'
import CoffeeIcon from '../icons/CoffeeIcon.vue'
import HelpDeskIcon from '../icons/HelpDeskIcon.vue'
import ScheduleIcon from '../icons/ScheduleIcon.vue'

// TODO:
// - improve SideTabs variables and remove hacks below
// - update #getDefaultRoutes to not include icons

const iconMap: Record<string, Vue.Component | undefined> = {
  [Routes.Atrium]: AtriumIcon,
  [Routes.CoffeeChatLobby]: CoffeeIcon,
  [Routes.HelpDesk]: HelpDeskIcon,
  [Routes.Schedule]: ScheduleIcon,
  [Routes.WhatsOn]: ScheduleIcon,
}

export default Vue.extend({
  components: {
    AppLayout,
    PageFooter,
    BrandA,
    // BrandB,
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

      const routes = getDefaultRoutes(
        this.user,
        this.settings,
        (key) => this.$t(key) as string
      )

      for (const r of routes) {
        r.icon = iconMap[r.name] ?? r.icon
      }

      return routes
    },
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>

<style lang="scss">
.IfrcAppLayout {
  .sideTabs-tab.is-active {
    background: $white-ter;
  }
  .sideTabs {
    border-inline-end: 1px solid $border;
  }
  .atriumLayout {
    background-image: url(/img/background.png);
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 7em;
  }
}
.IfrcAppLayout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}
</style>
