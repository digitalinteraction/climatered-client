<template>
  <BrandedAppLayout>
    <div class="whatsOnView" v-if="schedule">
      <div class="whatsOnView-header">
        <h1 class="whatsOnView-title">
          {{ $t('ifrc.whatsOn.title') }}
        </h1>
        <div class="content">
          <p>{{ $t('ifrc.whatsOn.infoText') }}</p>
        </div>
        <ScheduleFilters
          :session-types="schedule.types"
          :tracks="schedule.tracks"
          :themes="schedule.themes"
          :session-slots="schedule.slots"
          :filters="filters"
          @filter="onFilter"
          :enabled-filters="enabledFilters"
        />
      </div>
      <div class="whatsOnView-sessions">
        <SessionBoard>
          <SessionTile
            v-for="session in filteredSessions"
            :key="session.id"
            :slot-state="slotState"
            :session="session"
            :schedule="schedule"
            :config="scheduleConfig"
            @track-ical="trackIcal"
          />
        </SessionBoard>
      </div>
    </div>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import {
  mapApiState,
  ScheduleConfig,
  ScheduleFilterRecord,
  ScheduleFilters,
  SessionTile,
  SessionBoard,
  loadScheduleFilters,
  createFilterPredicate,
  SlotState,
} from '@openlab/deconf-ui-toolkit'
import { Session } from '@openlab/deconf-shared'
import { StorageKey } from '@/lib/module'

interface Data {
  filters: ScheduleFilterRecord
  enabledFilters: (keyof ScheduleFilterRecord)[]
  scheduleConfig: ScheduleConfig
}

export default Vue.extend({
  components: { BrandedAppLayout, ScheduleFilters, SessionTile, SessionBoard },
  data(): Data {
    return {
      filters: loadScheduleFilters('whatsOnFilters'),
      enabledFilters: ['query', 'sessionType', 'theme'],
      scheduleConfig: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'languages', 'recorded'],
      },
    }
  },
  computed: {
    ...mapApiState('api', ['schedule']),
    filteredSessions(): Session[] {
      if (!this.schedule) return []

      const predicate = createFilterPredicate(
        this.$i18n.locale,
        this.filters,
        this.schedule
      )
      if (!predicate) return this.schedule.sessions

      return this.schedule.sessions.filter((s) => predicate(s))
    },
    slotState(): SlotState {
      return 'future'
    },
  },
  methods: {
    onFilter(filters: ScheduleFilterRecord) {
      this.filters = filters
      Vue.nextTick(() => {
        const json = JSON.stringify(filters)
        localStorage.setItem(StorageKey.WhatsOnFilters, json)
      })
    },
    trackIcal(session: Session) {
      // ...
    },
  },
})
</script>

<style lang="scss">
.whatsOnView-header {
  padding: $block-spacing;
  background-color: $white;
  border-bottom: 1px solid $border;
}
.whatsOnView-title {
  // TODO: what happened to this? wasn't there a mixin?
  // font-family: $title-font;
  font-size: $size-3;
  font-weight: bold;
}
.whatsOnView-sessions {
  background: $background;
}

// TODO: update SessionBoard component
.sessionBoard {
  margin: 0;
  padding: 1.5rem;
}

.sessionTile-actions .joinSession {
  display: none;
}
</style>
