<template>
  <footer class="footer">
    <div class="content has-text-centered">
      Made by
      <a href="https://openlab.ncl.ac.uk">Open Lab</a>
      /

      <!-- Iterate links -->
      <span v-for="link in footerLinks" :key="link.key">
        <router-link class="is-faded" :to="link.route" v-t="link.key" />
        /
      </span>
      <a
        class=" is-faded"
        @click.prevent="triggerCookies"
        v-t="'cookies.title'"
        :title="$t('cookies.popupTitle')"
      />
      /
      {{ $t('general.appName') }}
      {{ appVersion }}
    </div>
  </footer>
</template>

<script>
//
// The common site footer
//

const footerLinks = [
  {
    key: 'privacy.title',
    route: { name: ROUTE_PRIVACY }
  },
  {
    key: 'faqs.title',
    route: { name: ROUTE_FAQS }
  }
]

import { ROUTE_PRIVACY, ROUTE_FAQS } from '../const'
import { CookieEvents } from '@/components/CookiePopup.vue'

export default {
  data() {
    const appName = process.env.VUE_APP_NAME
    const appVersion =
      window.CONFIG?.BUILD_NAME || 'v' + process.env.VUE_APP_VERSION
    return { appName, appVersion, footerLinks }
  },
  methods: {
    triggerCookies() {
      CookieEvents.$emit('trigger')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer .content {
  color: $grey;
  a {
    font-weight: bold;
  }

  a.is-faded {
    color: $grey-dark;
  }
}

.footer.is-grey {
  background: $grey-lightest;
  .content {
    color: $grey-dark;
  }
}
</style>
