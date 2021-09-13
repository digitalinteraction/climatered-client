<template>
  <BrandedAppLayout>
    <div class="scheduleView" v-if="schedule">
      <div class="scheduleView-header">
        <div class="scheduleView-headerSplit">
          <h1 class="scheduleView-title">
            {{ $t('ifrc.schedule.title') }}
          </h1>
          <div class="scheduleView-viewControl">
            <!-- <SegmentField
              v-model="filters.viewMode"
              :options="viewModeOptions"
            /> -->
          </div>
        </div>
        <p class="scheduleView-content">
          <!-- <FilterContent /> -->
        </p>
        <ScheduleFilters
          :session-types="schedule.types"
          :session-slots="schedule.slots"
          :tracks="schedule.tracks"
          :themes="schedule.themes"
          :filters="filters"
          :enabledFilters="enabledFilters"
          @filter="onFilter"
        />
      </div>
      <div class="scheduleView-blocks">
        <!--
          Space for sessions that have already passed.
          Only shown when "during" the conference
        -->
        <template v-if="previousDays && previousDays.length > 0">
          <template v-if="showPastSessions">
            <div
              class="scheduleView-day is-passed"
              v-for="day in previousDays"
              :key="day.title + '-past'"
            >
              <StickyHeading :title="day.title" title-class="is-dark">
                <ScheduleBlock
                  v-for="group of day.groups"
                  :key="group.slot.id"
                  :current-date="scheduleDate"
                  :session-slot="group.slot"
                  :sessions="group.sessions"
                  :schedule="schedule"
                  :config="scheduleConfig"
                  :show-other-sessions="showOtherSessions"
                />
              </StickyHeading>
            </div>
          </template>
          <div class="scheduleView-toggleHistory">
            <div class="buttons is-centered">
              <button class="button is-text" @click="togglePastSessions">
                {{ localePastAction }}
              </button>
            </div>
          </div>
        </template>

        <NoResults v-if="filteredSessions.length === 0">
          {{ $t('ifrc.schedule.noResults') }}
        </NoResults>

        <div
          class="scheduleView-day"
          v-else
          v-for="day of upcomingDays"
          :key="day.title"
        >
          <StickyHeading :title="day.title">
            <ScheduleBlock
              v-for="group of day.groups"
              :key="group.slot.id"
              :current-date="scheduleDate"
              :session-slot="group.slot"
              :sessions="group.sessions"
              :schedule="schedule"
              :config="scheduleConfig"
              :show-other-sessions="showOtherSessions"
            />
          </StickyHeading>
        </div>
      </div>
    </div>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'
import {
  FullSchedule,
  isDuringConference,
  loadScheduleFilters,
  mapApiState,
  ScheduleConfig,
  ScheduleFilterRecord,
  SelectOption,
  ScheduleFilters,
  StickyHeading,
  ScheduleBlock,
  NoResults,
} from '@openlab/deconf-ui-toolkit'
import { StorageKey } from '@/lib/constants'
import { TranslateResult } from 'vue-i18n'
import { scheduleComputed } from '@/lib/module'

interface Data {
  showPastSessions: boolean
  filters: ScheduleFilterRecord
  viewModeOptions: SelectOption[]
  scheduleConfig: ScheduleConfig
  enabledFilters: Array<keyof ScheduleFilterRecord>
}

export default Vue.extend({
  components: {
    BrandedAppLayout,
    ScheduleFilters,
    StickyHeading,
    ScheduleBlock,
    NoResults,
  },
  data(): Data {
    return {
      showPastSessions: false,
      filters: loadScheduleFilters(StorageKey.ScheduleFilters),
      viewModeOptions: [
        { value: 'all', text: this.$t('ifrc.schedule.allSessions') },
        { value: 'user', text: this.$t('ifrc.schedule.userSessions') },
      ],
      scheduleConfig: {
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
    localePastAction(): TranslateResult {
      return this.showPastSessions
        ? this.$t('ifrc.schedule.hidePast')
        : this.$t('ifrc.schedule.showPast')
    },
    isDuringConference(): boolean {
      return isDuringConference(
        this.scheduleDate,
        (this.schedule as FullSchedule).settings
      )
    },
    ...scheduleComputed(),
    showOtherSessions(): boolean {
      return this.filteredSessions.length < 50
    },
  },
  methods: {
    onFilter(filters: ScheduleFilterRecord) {
      this.filters = filters

      // TODO: store them
    },
    togglePastSessions() {
      this.showPastSessions = !this.showPastSessions
    },
  },
})
</script>

<style lang="scss">
.scheduleView {
  flex: 1; // Fill AppLayout
  background: $background;

  .scheduleBlock-slot {
    top: calc(#{$navbar-height} + 42px);
  }

  // TODO: move to deconf
  .scheduleBlock-sessions {
    margin-bottom: 0;
  }
}
.scheduleView-header {
  padding: $block-spacing;
  background-color: $white;
  border-bottom: 1px solid $border;
}
.scheduleView-toggleHistory {
  background: $background;
  padding: $block-spacing 0;
}

// TODO: move to deconf
.scheduleView-blocks:last-child {
  padding-bottom: $block-spacing * 5;
}
</style>
