<template>
  <div class="interpret-wrapper">
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
      <div class="navbar-menu is-active">
        <div class="navbar-end">
          <div class="navbar-item">
            <router-link
              :to="atriumRoute"
              class="button is-text"
              v-t="'interpretHome.exitAction'"
            />
          </div>
        </div>
      </div>
    </nav>
    <div class="interpret-wrapper-page">
      <slot />
    </div>
  </div>
</template>

<script>
//
// A common wrapper for interpret pages
//

import { ROUTE_ATRIUM } from '@/const'

export default {
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  }
}
</script>
