<template>
  <div class="util-wrapper">
    <div class="buttons">
      <slot name="back-button" />
    </div>
    <section class="section is-medium">
      <div class="container is-small">
        <div class="box is-centered">
          <div class="buttons is-right" v-if="pickLanguages">
            <LanguageControl v-if="pickLanguages" />
          </div>
          <slot name="content" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
//
// A wrapper for utility-like pages on the site, like login or privacy
// - configure whether to show a language control or not
//

import LanguageControl from '@/components/form/LanguageControl.vue'

export default {
  components: { LanguageControl },
  props: {
    pickLanguages: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss" scoped>
.util-wrapper {
  min-height: 100vh;
  background-color: $grey-lightest;

  .box {
    max-width: $tablet;
    margin: 0 auto;
  }

  .buttons {
    padding: 0.5em;
  }
}
</style>
