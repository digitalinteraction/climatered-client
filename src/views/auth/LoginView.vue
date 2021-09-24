<template>
  <IfrcUtilLayout>
    <LoginView api-module="api">
      <ApiContent slug="login" slot="infoText" />
      <p slot="doneText">
        {{ $t('deconf.login.doneText') }}
      </p>
    </LoginView>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import ApiContent from '@/components/ApiContent.vue'
import { LoginView } from '@openlab/deconf-ui-toolkit'

export default Vue.extend({
  components: { IfrcUtilLayout, LoginView, ApiContent },
})
</script>
