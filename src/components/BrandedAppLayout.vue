<template>
  <AppLayout :app-settings="settings" :user="user" :routes="routes">
    <img slot="brandA" src="/brand.svg" width="160" height="28" />
    <img slot="brandB" src="/openlab.svg" width="110" height="28" />
    <router-link slot="brandC" to="/atrium">
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
  AtriumIcon,
  CoffeeChatIcon,
  HelpDeskIcon,
  lib,
  ScheduleIcon,
  WhatsOnIcon,
  AppLayout,
} from '@openlab/deconf-ui-toolkit'
import PageFooter from './PageFooter.vue'

function generateRoutes(
  settings: lib.ConfigSettings | null,
  loggedIn: boolean,
  t: (key: string) => string
): lib.AppRoute[] {
  if (!settings) return []

  return [
    {
      title: t('deconf.appLayout.atrium'),
      name: lib.Routes.Atrium,
      icon: AtriumIcon,
      enabled: settings.atrium.enabled,
    },
    {
      title: t('deconf.appLayout.whatsOn'),
      name: lib.Routes.WhatsOn,
      icon: WhatsOnIcon,
      enabled: settings.whatsOn.enabled,
    },
    {
      title: t('deconf.appLayout.schedule'),
      name: lib.Routes.Schedule,
      icon: ScheduleIcon,
      enabled: settings.schedule.enabled,
    },
    {
      title: t('deconf.appLayout.coffeeChat'),
      name: lib.Routes.CoffeeChatLobby,
      icon: CoffeeChatIcon,
      enabled: settings.coffeeChat.enabled,
    },
    {
      title: t('deconf.appLayout.helpDesk'),
      name: lib.Routes.HelpDesk,
      icon: HelpDeskIcon,
      enabled: settings.helpDesk.enabled,
    },
  ]
}

export default Vue.extend({
  components: { AppLayout, PageFooter },
  computed: {
    settings(): lib.ConfigSettings | null {
      return this.$store.getters['api/settings']
    },
    user(): lib.AuthToken | null {
      return this.$store.getters['api/user']
    },
    routes(): lib.AppRoute[] {
      return generateRoutes(
        this.$store.getters['api/settings'],
        Boolean(this.$store.getters['api/user']),
        (key) => this.$t(key) as string
      )
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
