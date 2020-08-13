<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <div slot="content" class="not-found-page">
      <h1 class="title" v-t="'notFound.title'" />
      <p v-t="'notFound.info'" />
      <p><router-link :to="atriumRoute" v-t="'atrium.returnTo'" /></p>
    </div>
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '../const'

export default {
  components: { UtilWrapper },
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  }
}
</script>
