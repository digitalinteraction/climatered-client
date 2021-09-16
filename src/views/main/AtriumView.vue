<template>
  <BrandedAppLayout class="atriumView">
    <AtriumLayout v-if="settings">
      <BoxContent slot="left">
        <div class="atriumView-content">
          <ApiContent :slug="contentSlug" />
        </div>
      </BoxContent>
      <div slot="right">
        <ColorWidget
          kind="primary"
          v-if="showSiteVisitors"
          :title="`${siteVisitors === null ? '...' : siteVisitors}`"
          :subtitle="$t('ifrc.atrium.onlineNow')"
          :icon="['fas', 'user']"
        />
        <ColorWidget
          kind="secondary"
          :title="carbonNotEmitted"
          :subtitle="$t('ifrc.atrium.carbonSaved')"
          :icon="['fas', 'leaf']"
        />
        <ColorWidget
          kind="twitter"
          :title="$t('ifrc.atrium.twitterTitle')"
          :subtitle="$t('ifrc.atrium.twitterSubtitle')"
          :href="$t('ifrc.atrium.twitterUrl')"
          :icon="['fab', 'twitter']"
        />
      </div>
    </AtriumLayout>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import {
  AtriumLayout,
  BoxContent,
  ColorWidget,
  mapApiState,
  mapMetricsState,
} from '@openlab/deconf-ui-toolkit'
import ApiContent from '@/components/ApiContent.vue'
import { ConferenceConfig } from '@openlab/deconf-shared'

export default Vue.extend({
  components: {
    BrandedAppLayout,
    AtriumLayout,
    ColorWidget,
    BoxContent,
    ApiContent,
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'carbon']),
    ...mapMetricsState('metrics', ['siteVisitors']),
    settings(): ConferenceConfig | null {
      return this.schedule?.settings ?? null
    },
    showSiteVisitors(): boolean {
      if (!this.settings) return false
      return !this.settings.isStatic
    },
    contentSlug(): string {
      return this.user ? 'atrium-active' : 'atrium-public'
    },
    carbonNotEmitted(): string {
      if (!this.carbon) return '...'
      return Math.floor(this.carbon.carbonNotEmitted / 1000)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  mounted() {
    this.$store.dispatch('api/fetchCarbon')
  },
})
</script>

<style lang="scss">
.atriumView-content {
  min-height: 500px;
}
</style>
