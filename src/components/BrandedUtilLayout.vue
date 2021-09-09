<template>
  <UtilLayout :home-route="atriumRoute">
    <BrandA slot="brand" />

    <BackButton slot="back-button" :to="atriumRoute">
      {{ $t('ifrc.general.backToAtrium') }}
    </BackButton>

    <slot name="main" slot="main" />

    <PageFooter slot="footer" />
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'

import { UtilLayout, BackButton, Routes } from '@openlab/deconf-ui-toolkit'
import PageFooter from './PageFooter.vue'
import BrandA from '../branding/BrandA.vue'

export default Vue.extend({
  components: { UtilLayout, BackButton, PageFooter, BrandA },
  computed: {
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>
