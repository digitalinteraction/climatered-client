<template>
  <BrandedAppLayout class="atriumView">
    <AtriumLayout slot="main">
      <BoxContent slot="left">
        <div class="atriumView-content">
          <ApiContent :slug="contentSlug" />
        </div>
      </BoxContent>
    </AtriumLayout>
    <div slot="right">
      <p>Widgets...</p>
    </div>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import { AtriumLayout, BoxContent } from '@openlab/deconf-ui-toolkit'
import ApiContent from '@/components/ApiContent.vue'
import { AuthToken } from '@/lib/module'

export default Vue.extend({
  components: { BrandedAppLayout, AtriumLayout, BoxContent, ApiContent },
  computed: {
    contentSlug(): string {
      return this.user ? 'atrium-active' : 'atrium-public'
    },
    user(): AuthToken | null {
      return this.$store.getters['api/user']
    },
  },
})
</script>

<style lang="scss">
.atriumView-content {
  min-height: 500px;
}
</style>
