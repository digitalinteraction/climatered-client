<template>
  <IfrcUtilLayout width="large">
    <BackButton :to="scheduleRoute" slot="backButton">
      {{ $t('ifrc.interpretBooth.backButton') }}
    </BackButton>
    <div slot="default">
      <h1 class="title">
        {{ $t('ifrc.interpretBooth.title') }}
      </h1>
      Interpreter Booth
      {{ sessionId }}
      &ndash;
      {{ channel }}
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import { BackButton, Routes } from '@openlab/deconf-ui-toolkit'

export default Vue.extend({
  components: { IfrcUtilLayout, BackButton },
  props: {
    sessionId: { type: String, required: true },
    channel: { type: String, required: true },
  },
  computed: {
    scheduleRoute() {
      return { name: Routes.InterpretHome }
    },
  },
})
</script>
