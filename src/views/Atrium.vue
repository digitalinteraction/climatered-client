<template>
  <div class="atrium">
    <img class="atrium-hero" src="/img/atrium.svg" />
    <div class="atrium-info">
      <section class="section">
        <div class="columns">
          <div class="column is-two-thirds">
            <div class="container">
              <div
                v-if="currentContent"
                class="content"
                v-html="currentContent"
              />
            </div>
          </div>
          <div class="column">
            <a
              class="twitter-timeline"
              href="https://twitter.com/dog_rates?ref_src=twsrc%5Etfw"
              data-height="600"
              data-dnt="true"
              >{{ $t('atrium.tweetTitle') }}</a
            >
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import contentEN from '@/content/atrium/en.md'
import contentFR from '@/content/atrium/fr.md'
import contentES from '@/content/atrium/es.md'
import contentAR from '@/content/atrium/ar.md'

const content = {
  en: contentEN,
  fr: contentFR,
  es: contentES,
  ar: contentAR,
  dev: 'atrium.content'
}

export default {
  computed: {
    currentContent() {
      return content[this.$i18n.locale]
    }
  },
  async mounted() {
    await import(
      /* webpackIgnore: true */ 'https://platform.twitter.com/widgets.js'
    )
  }
}
</script>

<style lang="scss" scoped>
.atrium {
}

.atrium-hero {
  width: 100%;
  height: auto;
  border-bottom: 1px solid $border;
}
</style>
