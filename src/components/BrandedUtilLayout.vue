<template>
  <UtilLayout :home-route="atriumRoute">
    <BrandA slot="brand" />

    <BackButton slot="backButton" :to="atriumRoute">
      {{ $t('ifrc.general.backToAtrium') }}
    </BackButton>

    <LanguageControl slot="languageControl" />

    <slot slot="main" />

    <PageFooter slot="footer" />
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'

import { UtilLayout, BackButton, Routes } from '@openlab/deconf-ui-toolkit'
import PageFooter from './PageFooter.vue'
import LanguageControl from './LanguageControl.vue'
import BrandA from '../branding/BrandA.vue'

export default Vue.extend({
  components: { UtilLayout, BackButton, PageFooter, BrandA, LanguageControl },
  computed: {
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>
