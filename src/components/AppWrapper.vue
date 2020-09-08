<template>
  <div class="app-wrapper">
    <div class="app-header">
      <div class="app-header-start">
        <!-- Nav bar -->
        <NavBar />
      </div>
    </div>

    <!-- Side tabs -->
    <SideTabs />

    <!-- Page wrapper -->
    <div class="app-page" v-if="hasData">
      <slot />
    </div>
    <AppFooter v-if="showFooter" class="app-footer" />
  </div>
</template>

<script>
//
// A wrapper for most pages on the site.
// adding nav, tabs and a <slot> for the page
// and only displays <slot> when data has been fetched
//
import { mapState } from 'vuex'

import AppFooter from '@/components/AppFooter.vue'

import NavBar from '@/components/layout/NavBar.vue'
import SideTabs from '@/components/layout/SideTabs.vue'

export default {
  components: { AppFooter, NavBar, SideTabs },
  props: {
    showFooter: { type: Boolean, default: true }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState']),
    hasData() {
      return this.apiState === 'active'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  // fall back to 100% on IE
  min-height: calc(100% - #{$navbar-height});
  min-height: calc(100vh - #{$navbar-height});

  position: relative;
  display: flex;
  flex-direction: column;
}

.app-page {
  flex: 1;

  position: relative;
  @include desktop {
    margin-inline-start: $tabbar-width;
  }
}

.app-header {
  z-index: 50;
}
</style>
