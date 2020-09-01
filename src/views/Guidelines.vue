<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <component
      v-if="currentContent"
      :is="currentContent"
      slot="content"
      class="content"
    />
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '../const'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/guidelines/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/guidelines/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/guidelines/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/guidelines/ar.mdx')
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
