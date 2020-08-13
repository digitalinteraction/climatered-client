<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <div slot="content" class="content">
      <h1>{{ message }}</h1>
    </div>
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '@/const'

export default {
  components: { UtilWrapper },
  data() {
    return {
      message: this.$route.query.message ?? 'Something went wrong',
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  }
}
</script>
