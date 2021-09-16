<template>
  <BrandedAppLayout>
    <ScheduleView
      v-if="schedule"
      :schedule="schedule"
      :sessions="filteredSessions"
      :filters-key="filtersKey"
      :config="config"
      :schedule-date="scheduleDate"
      :enabled-filters="enabledFilters"
      :is-during-conference="isDuringConference"
    />
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import {
  FullSchedule,
  isDuringConference,
  mapApiState,
  ScheduleConfig,
  ScheduleFilterRecord,
  ScheduleView,
} from '@openlab/deconf-ui-toolkit'
import { StorageKey } from '@/lib/constants'
import { Session } from '@openlab/deconf-shared'

interface Data {
  filtersKey: string
  config: ScheduleConfig
  enabledFilters: Array<keyof ScheduleFilterRecord>
}

export default Vue.extend({
  components: { BrandedAppLayout, ScheduleView },
  data(): Data {
    return {
      filtersKey: StorageKey.ScheduleFilters,
      config: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'recorded', 'languages'],
      },
      enabledFilters: ['query', 'sessionType', 'theme', 'date', 'isRecorded'],
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'userSessions']),
    scheduleDate(): Date {
      return this.$dev.scheduleDate || this.$temporal.date
    },
    filteredSessions(): Session[] {
      if (!this.schedule) return []

      // TODO: custom filtering here

      return this.schedule.sessions
    },
    isDuringConference(): boolean {
      return isDuringConference(
        this.scheduleDate,
        (this.schedule as FullSchedule).settings
      )
    },
  },
})
</script>

<style lang="scss">
// ...
</style>
