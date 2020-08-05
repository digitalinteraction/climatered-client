<template>
  <footer class="footer">
    <div class="content has-text-centered">
      Made by
      <a href="https://openlab.ncl.ac.uk">Openlab</a>
      /
      <router-link class="is-faded" :to="termsLink" v-t="'terms.title'" />
      /
      <router-link class="is-faded" :to="privacyLink" v-t="'privacy.title'" />
      /
      {{ $t('general.appName') }}
      v{{ appVersion }}
    </div>
  </footer>
</template>

<script>
import { ROUTE_PRIVACY, ROUTE_TERMS } from '../const'

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
