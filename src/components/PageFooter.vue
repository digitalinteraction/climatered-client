<template>
  <div class="pageFooter">
    <p class="pageFooter-line">
      <!-- Iterate links -->
      <span v-for="(link, i) in footerLinks" :key="link.key">
        <a :href="link.url" target="_blank" rel="noopener">
          {{ link.title }}
        </a>
        <template v-if="i < footerLinks.length - 1"> / </template>
      </span>
    </p>
    <p class="pageFooter-line">
      Made by
      <a href="https://openlab.ncl.ac.uk/" target="_blank" rel="noopener">
        Open Lab
      </a>
      /
      {{ appName }}
      {{ appVersion }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'

//
// TODO: move to deconf-ui-toolkit
//

interface Data {
  appName: TranslateResult
  appVersion: string
  footerLinks: Array<{
    title: TranslateResult
    url: TranslateResult
  }>
}

export default Vue.extend({
  data(): Data {
    return {
      appName: this.$t('ifrc.footer.appName'),
      appVersion: this.$env.BUILD_NAME ?? `v${process.env.VUE_APP_VERSION}`,
      footerLinks: [
        {
          title: this.$t('ifrc.footer.privacy'),
          url: this.$t('ifrc.footer.privacyUrl'),
        },
        {
          title: this.$t('ifrc.footer.terms'),
          url: this.$t('ifrc.footer.termsUrl'),
        },
        {
          title: this.$t('ifrc.footer.guidelines'),
          url: this.$t('ifrc.footer.guidelinesUrl'),
        },
      ],
    }
  },
})
</script>

<style lang="scss">
.pageFooter {
  color: $grey-dark;
  background-color: #ededed;
  padding: 1.5rem 1.5rem 2.5rem;

  a {
    color: $grey-darker;
    font-weight: $weight-bold;
  }
}
.pageFooter-line {
  text-align: center;

  &:not(:last-child) {
    margin-bottom: 0.5em;
  }
}
</style>
