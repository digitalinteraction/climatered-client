<template>
  <div class="interpret-wrapper">
    <div class="interpret-wrapper-header">
      <div class="buttons is-right">
        <router-link
          :to="atriumRoute"
          class="button is-text"
          v-t="'atrium.returnTo'"
        />
      </div>
    </div>
    <div class="interpret-wrapper-page">
      <slot />
    </div>
  </div>
</template>

<script>
import { ROUTE_ATRIUM } from '@/const'

export default {
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  }
}
</script>
