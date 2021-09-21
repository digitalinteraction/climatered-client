<template>
  <BrandedUtilLayout>
    <LoginView api-module="api">
      <ApiContent slug="login" slot="infoText" />
      <p slot="doneText">
        {{ $t('deconf.login.doneText') }}
      </p>
    </LoginView>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import ApiContent from '@/components/ApiContent.vue'
import { LoginView } from '@openlab/deconf-ui-toolkit'

export default Vue.extend({
  components: { BrandedUtilLayout, LoginView, ApiContent },
})
</script>
