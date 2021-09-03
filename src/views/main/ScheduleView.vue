<template>
  <BrandedAppLayout>
    <section class="section" slot="main">
      <div class="container">
        <p>Schedule</p>
      </div>
    </section>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'

export default Vue.extend({
  components: { BrandedAppLayout },
})
</script>
