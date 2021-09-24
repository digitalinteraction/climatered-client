<template>
  <IfrcAppLayout>
    <WhatsOnView
      v-if="schedule"
      :schedule="schedule"
      :sessions="filteredSessions"
      :filters-key="filtersKey"
      :enabled-filters="enabledFilters"
      :config="config"
      :slot-state="slotState"
    />
  </IfrcAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcAppLayout from '@/components/IfrcAppLayout.vue'
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
  sessions: Session[] | null
}

const typeBlocklist = new Set(['unknown', 'coffee-time'])

export default Vue.extend({
  components: { IfrcAppLayout, WhatsOnView },
  data(): Data {
    return {
      filtersKey: StorageKey.WhatsOnFilters,
      enabledFilters: ['query', 'sessionType', 'theme'],
      config: {
        tileHeader: ['type'],
        tileAttributes: ['languages'],
      },
      sessions: null,
    }
  },
  computed: {
    ...mapApiState('api', ['schedule']),
    filteredSessions(): Session[] {
      if (!this.sessions || !this.schedule) return []

      // Chance to apply custom filters
      return this.sessions.filter((s) => !typeBlocklist.has(s.type))
    },
    slotState(): SlotState {
      return 'future'
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.sessions = await this.$store.dispatch('api/fetchWhatsOn')
    },
  },
})
</script>

<style lang="scss">
// ...
</style>
