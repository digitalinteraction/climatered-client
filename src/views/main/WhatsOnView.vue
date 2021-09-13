<template>
  <BrandedAppLayout>
    <WhatsOnView
      v-if="schedule"
      :schedule="schedule"
      :sessions="filteredSessions"
      :filters-key="filtersKey"
      :enabled-filters="enabledFilters"
      :config="config"
      :slot-state="slotState"
    />
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import {
  mapApiState,
  ScheduleConfig,
  ScheduleFilterRecord,
  WhatsOnView,
  SlotState,
} from '@openlab/deconf-ui-toolkit'
import { Session } from '@openlab/deconf-shared'
import { StorageKey } from '@/lib/module'

interface Data {
  filtersKey: string
  enabledFilters: (keyof ScheduleFilterRecord)[]
  config: ScheduleConfig
}

export default Vue.extend({
  components: { BrandedAppLayout, WhatsOnView },
  data(): Data {
    return {
      filtersKey: StorageKey.WhatsOnFilters,
      enabledFilters: ['query', 'sessionType', 'theme'],
      config: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'languages', 'recorded'],
      },
    }
  },
  computed: {
    ...mapApiState('api', ['schedule']),
    filteredSessions(): Session[] {
      if (!this.schedule) return []

      // Chance to apply custom filters
      return this.schedule.sessions
    },
    slotState(): SlotState {
      return 'future'
    },
  },
})
</script>

<style lang="scss">
// ...
</style>
