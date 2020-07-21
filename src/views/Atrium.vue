<template>
  <div class="atrium">
    <img class="atrium-hero" src="/img/atrium.svg" />
    <div class="atrium-info">
      <section class="section">
        <div class="columns">
          <div class="column is-three-fifths">
            <div class="container">
              <div
                v-if="currentContent"
                class="content"
                v-html="currentContent"
              />
            </div>
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
  ar: contentAR
}

export default {
  computed: {
    currentContent() {
      return content[this.$i18n.locale]
    }
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
