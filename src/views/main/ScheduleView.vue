<template>
  <IfrcAppLayout>
    <ScheduleView
      v-if="schedule"
      :schedule="schedule"
      :sessions="filteredSessions"
      :user-sessions="userSessions"
      :filters-key="filtersKey"
      :config="config"
      :schedule-date="scheduleDate"
      :enabled-filters="enabledFilters"
      :is-during-conference="isDuringConference"
      :language-options="languages"
    >
      <p slot="infoText">{{ $t('deconf.schedule.description') }}</p>
    </ScheduleView>
  </IfrcAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcAppLayout from '@/components/IfrcAppLayout.vue'
import {
  FullSchedule,
  isDuringConference,
  mapApiState,
  ScheduleConfig,
  ScheduleFilterRecord,
  ScheduleView,
  SelectOption,
} from '@openlab/deconf-ui-toolkit'
import { StorageKey } from '@/lib/constants'
import { Session } from '@openlab/deconf-shared'
import { getLanguageOptions } from '@/lib/module'

interface Data {
  filtersKey: string
  config: ScheduleConfig
  enabledFilters: Array<keyof ScheduleFilterRecord>
  languages: SelectOption[]
}

export default Vue.extend({
  components: { IfrcAppLayout, ScheduleView },
  data(): Data {
    return {
      filtersKey: StorageKey.ScheduleFilters,
      config: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'recorded', 'languages', 'organisation'],
      },
      enabledFilters: [
        'query',
        'sessionType',
        'theme',
        'date',
        'isRecorded',
        'language',
      ],
      languages: getLanguageOptions(),
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'userSessions']),
    scheduleDate(): Date {
      return this.$dev.scheduleDate || this.$temporal.date
    },
    filteredSessions(): Session[] {
      if (!this.schedule) return []

      // custom filtering here ?

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
