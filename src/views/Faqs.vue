<template>
  <ContentWrapper :content="content" />
</template>

<script>
import ContentWrapper from '@/components/ContentWrapper.vue'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/faqs/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/faqs/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/faqs/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/faqs/ar.mdx')
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
