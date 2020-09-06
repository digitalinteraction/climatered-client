<template>
  <div class="app-wrapper">
    <div class="app-header">
      <div class="app-header-start">
        <!--
            Nav bar
            .has-shadow
            .has-border
        -->
        <nav
          class="navbar has-border is-fixed-top"
          role="navigation"
          aria-label="main navigation"
        >
          <div class="navbar-brand">
            <!-- Logo -->
            <router-link :to="atriumRoute" class="navbar-item" active-class="">
              <img
                src="/img/brand-new.svg"
                alt="Home"
                width="160"
                height="28"
              />
            </router-link>

            <!-- Menu button (burger) -->
            <a
              role="button"
              class="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              @click.prevent="toggleMenu"
              ref="menuButton"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <!-- Menu -->
          <NavMenu :showing-menu="showingMenu" />
        </nav>
      </div>
    </div>

    <!-- Side tabs -->
    <SideTabs />

    <!-- Page wrapper -->
    <div class="app-page" v-if="hasData">
      <slot />
    </div>

    <!-- Footer -->
    <AppFooter class="app-footer" />
  </div>
</template>

<script>
//
// A wrapper for most pages on the site.
// adding nav, tabs and a <slot> for the page
// and only displays <slot> when data has been fetched
//
import NavigationMixin from '@/mixins/NavigationMixin.js'

import { mapState } from 'vuex'

import AppFooter from '@/components/AppFooter.vue'

import NavMenu from '@/components/layout/NavMenu.vue'
import SideTabs from '@/components/layout/SideTabs.vue'

export default {
  mixins: [NavigationMixin],
  components: { AppFooter, NavMenu, SideTabs },
  data() {
    return {
      showingMenu: false
    }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState']),
    hasData() {
      return this.apiState === 'active'
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
    }
  }
}
</script>

<style lang="scss" scoped>
$tri-height: $navbar-height / 2;
$tri-width: $tabbar-width / 2;

.app-wrapper {
  position: relative;
  min-height: 100vh;
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

.navbar-brand {
  @include desktop {
    &:before {
      content: '';
      display: inline-block;
      border-block-end: solid $tri-height $cc-coral;
      border-inline-start: solid $tri-width $cc-coral;
      border-inline-end: solid $tri-width $white;
      border-block-start: solid $tri-height $white;
    }
  }
}
</style>
