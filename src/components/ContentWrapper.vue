<template>
  <UtilWrapper>
    <BackButton
      slot="back-button"
      :to="atriumRoute"
      text-key="atrium.returnTo"
    />
    <component class="content" slot="content" v-if="content" :is="content" />
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import BackButton from '@/components/BackButton.vue'
import { ROUTE_ATRIUM } from '../const'

export default {
  components: { UtilWrapper, BackButton },
  props: {
    content: { type: Function, default: null }
  },
  data() {
    return {
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  }
}
</script>
