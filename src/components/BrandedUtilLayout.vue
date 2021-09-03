<template>
  <UtilLayout :home-route="atriumRoute">
    <img slot="brand" src="/brand.svg" width="160" height="28" />

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

import { UtilLayout, BackButton, lib } from '@openlab/deconf-ui-toolkit'
import PageFooter from './PageFooter.vue'

export default Vue.extend({
  components: { UtilLayout, BackButton, PageFooter },
  computed: {
    atriumRoute(): Location {
      return { name: lib.Routes.Atrium }
    },
  },
})
</script>
