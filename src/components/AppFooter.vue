<template>
  <footer class="footer" aria-label="Site footer">
    <div class="content has-text-centered">
      Made by
      <a href="https://openlab.ncl.ac.uk" tabindex="0">Open Lab</a>
      <!-- /
      <router-link class="is-faded" :to="termsLink" v-t="'terms.title'" /> -->
      /
      <router-link
        class="is-faded"
        :to="privacyLink"
        v-t="'privacy.title'"
        tabindex="0"
      />
      /
      <a
        class=" is-faded"
        @click.prevent="triggerCookies"
        v-t="'cookies.title'"
        tabindex="0"
      />
      /
      {{ $t('general.appName') }}
      v{{ appVersion }}
    </div>
  </footer>
</template>

<script>
import { ROUTE_PRIVACY, ROUTE_TERMS } from '../const'
import { CookieEvents } from '@/components/CookiePopup.vue'

export default {
  computed: {
    appName() {
      return process.env.VUE_APP_NAME
    },
    appVersion() {
      return process.env.VUE_APP_VERSION
    },
    termsLink() {
      return { name: ROUTE_TERMS }
    },
    privacyLink() {
      return { name: ROUTE_PRIVACY }
    }
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
</style>
