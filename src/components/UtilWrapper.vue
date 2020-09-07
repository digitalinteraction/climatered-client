<template>
  <div class="util-wrapper">
    <nav
      class="navbar has-border is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <router-link :to="atriumRoute" class="navbar-item" active-class="">
          <img src="/img/brand-new.svg" alt="Home" width="160" height="28" />
        </router-link>
      </div>
    </nav>
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

import { ROUTE_ATRIUM } from '@/const'
import LanguageControl from '@/components/form/LanguageControl.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  components: { LanguageControl, AppFooter },
  props: {
    pickLanguages: { type: Boolean, default: true }
  },
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
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
