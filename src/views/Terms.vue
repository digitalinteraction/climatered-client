<template>
  <ContentWrapper :content="content" />
</template>

<script>
import ContentWrapper from '@/components/ContentWrapper.vue'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/terms/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/terms/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/terms/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/terms/ar.mdx')
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
