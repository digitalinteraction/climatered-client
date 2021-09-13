<template>
  <BrandedUtilLayout>
    <LoginView api-module="api" />
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import { LoginView } from '@openlab/deconf-ui-toolkit'

export default Vue.extend({
  components: { BrandedUtilLayout, LoginView },
})
</script>
