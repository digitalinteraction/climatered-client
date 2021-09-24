<template>
  <IfrcUtilLayout>
    <div>
      <ApiContent slug="privacy" />
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import ApiContent from '@/components/ApiContent.vue'

export default Vue.extend({
  components: { IfrcUtilLayout, ApiContent },
})
</script>
