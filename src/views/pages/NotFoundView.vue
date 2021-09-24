<template>
  <IfrcUtilLayout>
    <div class="content">
      <h1>{{ $t('ifrc.notFound.title') }}</h1>
      <p>{{ $t('ifrc.notFound.info') }}</p>
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'

export default Vue.extend({
  components: { IfrcUtilLayout },
})
</script>
