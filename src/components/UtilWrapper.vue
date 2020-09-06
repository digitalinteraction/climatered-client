<template>
  <div class="util-wrapper">
    <div class="buttons is-marginless">
      <slot name="back-button" />
    </div>
    <section class="section">
      <div class="box is-small">
        <div class="buttons is-right" v-if="pickLanguages">
          <LanguageControl v-if="pickLanguages" />
        </div>
        <slot name="content" />
      </div>
    </section>
    <AppFooter class="is-grey" />
  </div>
</template>

<script>
//
// A wrapper for utility-like pages on the site, like login or privacy
// - configure whether to show a language control or not
//

import LanguageControl from '@/components/form/LanguageControl.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  components: { LanguageControl, AppFooter },
  props: {
    pickLanguages: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss" scoped>
.util-wrapper {
  min-height: 100vh;
  background-color: $grey-lightest;
  display: flex;
  flex-direction: column;

  > .section {
    flex: 1;
  }

  > .box {
    max-width: $tablet;
    margin: 0 auto;
  }

  > .buttons {
    padding: 0.5em;
  }
}
</style>
