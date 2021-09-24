<template>
  <BrandedUtilLayout>
    <div class="content">
      <h1>{{ $t('ifrc.notFound.title') }}</h1>
      <p>{{ $t('ifrc.notFound.info') }}</p>
    </div>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'

export default Vue.extend({
  components: { BrandedUtilLayout },
})
</script>
