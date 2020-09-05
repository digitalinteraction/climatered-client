<template>
  <ContentWrapper :content="content" />
</template>

<script>
import ContentWrapper from '@/components/ContentWrapper.vue'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/privacy/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/privacy/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/privacy/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/privacy/ar.mdx')
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
