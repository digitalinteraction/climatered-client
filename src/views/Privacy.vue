<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <div slot="content" class="content" v-html="currentContent"></div>
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '../const'

import contentEN from '@/content/privacy/en.md'
import contentFR from '@/content/privacy/fr.md'
import contentES from '@/content/privacy/es.md'
import contentAR from '@/content/privacy/ar.md'

const content = {
  en: contentEN,
  fr: contentFR,
  es: contentES,
  ar: contentAR,
  dev: 'privacy.content'
}

export default {
  components: { UtilWrapper },
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  },
  computed: {
    currentContent() {
      return content[this.$i18n.locale]
    }
  }
}
</script>
