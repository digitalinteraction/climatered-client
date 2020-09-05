<template>
  <ContentWrapper :content="content" />
</template>

<script>
import ContentWrapper from '@/components/ContentWrapper.vue'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/guidelines/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/guidelines/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/guidelines/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/guidelines/ar.mdx')
}

export default {
  components: { ContentWrapper },
  computed: {
    content() {
      return content[this.$i18n.locale]
    }
  }
}
</script>
