<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <component
      slot="content"
      v-if="currentContent"
      class="content"
      :is="currentContent"
    />
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '../const'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/terms/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/terms/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/terms/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/terms/ar.mdx')
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
