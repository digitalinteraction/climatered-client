<template>
  <BrandedUtilLayout>
    <div>
      <ApiContent slug="faqs" />
    </div>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import ApiContent from '@/components/ApiContent.vue'

export default Vue.extend({
  components: { BrandedUtilLayout, ApiContent },
})
</script>
