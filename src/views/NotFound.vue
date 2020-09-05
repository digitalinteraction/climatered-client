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
      <div class="content">
        <p v-t="'notFound.info'"></p>
      </div>

      <div class="buttons">
        <router-link
          class="button is-link"
          :to="atriumRoute"
          v-t="'atrium.returnTo'"
        />
      </div>
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
