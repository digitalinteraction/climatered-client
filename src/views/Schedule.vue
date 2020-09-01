<template>
  <AppWrapper>
    <!-- Modal for displaying detailed information about session attributes -->
    <!-- TODO: Add further details to modal and reenable click action -->
    <!-- <SessionAttributesModal :session.sync="modalSession" /> -->

    <div class="schedule">
      <!-- Page header -->
      <SchedulePageHeader class="is-light">
        <div slot="title">
          {{ $t(`schedule.title`) }}
        </div>
        <div slot="description">
          {{ $t(`schedule.description`) }}
        </div>
        <div slot="controls">
          <ScheduleFilters
            :active-filters.sync="activeFilters"
            :search-query.sync="searchQuery"
          />
        </div>
      </SchedulePageHeader>

      <!-- Display details of search results -->
      <ScheduleSectionHeader v-if="searchActive && searchQuery" class="is-dark">
        {{ $t('schedule.showingResultsFor', [searchQuery]) }}
      </ScheduleSectionHeader>

      <!-- Schedule wrapper -->
      <div class="date-sections">
        <section
          class="date-section"
          v-for="date in filteredSchedule"
          :key="date.id"
        >
          <!-- Date header (Day One / Day Two etc.) -->
          <ScheduleSectionHeader v-if="!searchActive" class="is-primary">
            {{ $t(`${date.title}`) }}
          </ScheduleSectionHeader>
          <!-- Wrapper for slots -->
          <div class="slot-section-wrapper">
            <!-- Show past sessions button -->
            <button
              v-if="!searchActive"
              id="past-sessions-toggle"
              class="button is-small is-text"
              @click="pastSessionsVisible = !pastSessionsVisible"
            >
              {{
                pastSessionsVisible
                  ? $t('schedule.hidePastSessions')
                  : $t('schedule.showPastSessions')
              }}
            </button>

            <!-- Loop and render slots -->
            <span
              v-for="scheduleSlot in slotsForDate(date.date)"
              :key="scheduleSlot.id"
            >
              <section
                v-if="slotIsVisible(scheduleSlot)"
                :class="[
                  'slot-section',
                  searchActive ? '' : slotState(scheduleSlot)
                ]"
              >
                <div class="columns">
                  <!-- Timestamp column -->
                  <div class="time-column">
                    <!-- Time and state for slot -->
                    <ScheduleSlotTime
                      :current-time="currentTime"
                      :schedule-slot="scheduleSlot"
                    />
                  </div>

                  <!-- Sessions -->
                  <div class="sessions-wrapper">
                    <!-- Main sessions -->
                    <SessionTile
                      v-for="session in filteredSessionsForSlot(scheduleSlot)"
                      :key="session.id"
                      :schedule-slot="scheduleSlot"
                      :slot-state="slotState(scheduleSlot)"
                      :session="session"
                      :session-state="slotState(scheduleSlot)"
                      @show-modal="handlesShowModal(session)"
                    />
                    <!-- Workshops -->
                    <ScheduleWorkshops
                      :schedule-slot="scheduleSlot"
                      :slot-state="slotState(scheduleSlot)"
                      :sessions="filteredWorkshopsForSlot(scheduleSlot)"
                      :search-active="searchActive"
                    />
                  </div>
                </div>
              </section>
            </span>
          </div>
        </section>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import { mapState } from 'vuex'

// Mixins
import ScheduleFiltersMixins from '@/mixins/ScheduleFiltersMixins.js'

// Components
import AppWrapper from '@/components/AppWrapper.vue'
import ScheduleFilters from '@/components/Schedule/ScheduleFilters.vue'
import SchedulePageHeader from '@/components/Schedule/SchedulePageHeader.vue'
import ScheduleSectionHeader from '@/components/Schedule/ScheduleSectionHeader.vue'
import SessionTile from '@/components/Schedule/SessionTile.vue'
import ScheduleSlotTime from '@/components/Schedule/ScheduleSlotTime.vue'
import ScheduleWorkshops from '@/components/Schedule/ScheduleWorkshops.vue'
// import SessionAttributesModal from '@/components/Schedule/SessionAttributesModal.vue'

const workshopTypes = [
  'games',
  'panel',
  'propose-a-speaker',
  'q-and-a',
  'doctor-patient-clinics',
  'fishbowl',
  'workshop',
  'virtual-tour'
]

const schedule = [
  {
    title: 'schedule.dates.ninth',
    date: new Date('Sep 9 2020')
  },
  {
    title: 'schedule.dates.tenth',
    date: new Date('Sep 10 2020')
  }
]

export default {
  name: 'Schedule',
  mixins: [ScheduleFiltersMixins],
  components: {
    AppWrapper,
    ScheduleFilters,
    SchedulePageHeader,
    ScheduleSectionHeader,
    SessionTile,
    ScheduleSlotTime,
    ScheduleWorkshops
    // SessionAttributesModal
  },
  mounted() {
    this.$clock.bind(this, () => {
      if (this.isDev && this.$route.query.time) {
        this.currentTime = parseInt(this.$route.query.time)
      } else {
        this.currentTime = Date.now()
      }
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  data() {
    return {
      schedule,
      currentTime: Date.now(),
      pastSessionsVisible: false,
      modalSession: undefined,
      searchQuery: undefined,
      activeFilters: {
        query: '',
        date: 'All',
        type: 'All',
        track: 'All',
        interactivity: 'All',
        platform: 'All',
        device: 'All',
        recorded: 'All'
      }
    }
  },
  computed: {
    ...mapState('api', ['sessions', 'slots']),
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
    searchActive() {
      // User has an active search query
      return this.searchQuery?.length > 0
    },
    filteredSchedule() {
      if (this.activeFilters.date === 'All') {
        return this.schedule
      }
      return this.schedule.filter(d => {
        return d.date.getDate() === new Date(this.activeFilters.date).getDate()
      })
    },
    filteredSlots() {
      let ordered = this.slots
      ordered = ordered.sort(function(a, b) {
        return new Date(a.start) - new Date(b.start)
      })
      ordered = ordered.filter(s => {
        return (
          this.filteredSessionsForSlot(s).length +
            this.filteredWorkshopsForSlot(s).length >
          0
        )
      })
      return ordered
    }
  },
  methods: {
    handlesShowModal(session) {
      this.modalSession = session
    },
    sessionIsWorkshop(session) {
      if (workshopTypes.indexOf(session.type) !== -1) {
        return true
      }
      return false
    },
    slotsForDate(date) {
      let ordered = this.slots
      ordered = ordered.filter(s => {
        const slotStart = new Date(s.start)

        const sameDay = slotStart.getDate() === date.getDate()
        const sameMonth = true //slotStart.getMonth() === date.getMonth()
        const sameYear = slotStart.getFullYear() === date.getFullYear()
        return sameDay && sameMonth && sameYear
      })
      ordered = ordered.sort(function(a, b) {
        return new Date(a.start) - new Date(b.start)
      })
      ordered = ordered.filter(s => {
        return (
          this.filteredSessionsForSlot(s).length +
            this.filteredWorkshopsForSlot(s).length >
          0
        )
      })
      return ordered
    },
    slotState(slot) {
      const start = new Date(slot.start).getTime()
      const end = new Date(slot.end).getTime()

      if (this.currentTime < start) return 'future'
      if (this.currentTime > end) return 'past'

      return 'present'
    },
    slotIsVisible(slot) {
      // Slot visibility is dependent on search and state
      return (
        this.slotState(slot) !== 'past' ||
        this.pastSessionsVisible ||
        this.searchActive
      )
    },
    filteredWorkshopsForSlot(slot) {
      let matchedSessions = this.sessions

      // Filter sessions by slot
      matchedSessions = matchedSessions.filter(s => {
        return s.slot === slot.id
      })

      // Filter sessions for workshops
      matchedSessions = matchedSessions.filter(s => {
        return this.sessionIsWorkshop(s)
      })

      // Apply search query
      matchedSessions = this.applySearchQuery(matchedSessions)

      // Apply filters
      matchedSessions = this.applyFilters(matchedSessions)

      return matchedSessions
    },
    filteredSessionsForSlot(slot) {
      let matchedSessions = this.sessions

      // Filter sessions by slot
      matchedSessions = matchedSessions.filter(s => {
        return s.slot === slot.id
      })

      // Filter sessions for non-workshops
      matchedSessions = matchedSessions.filter(s => {
        return !this.sessionIsWorkshop(s)
      })

      // Apply search query
      matchedSessions = this.applySearchQuery(matchedSessions)

      // Apply filters
      matchedSessions = this.applyFilters(matchedSessions)

      return matchedSessions
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule {
  background-color: $cc-lightestgrey;
  min-height: 100vh;
}

.date-section {
  &:not(:first-child) {
    margin-top: 30px;
  }

  #past-sessions-toggle {
    margin: 20px;
    margin-top: 0;
  }

  .slot-section-wrapper {
    background-color: $cc-lightestgrey;
    padding-bottom: 20px;
    padding-top: 20px;

    .slot-section {
      margin-bottom: 20px;
      position: relative;

      &.past {
        background-color: $cc-lightestgrey;

        .sessions-wrapper {
          background-color: $cc-lightergrey;
        }
      }

      &.present {
        z-index: 1;

        &:before {
          content: '';
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 0 15px 15px rgba(0, 0, 0, 0.03);
          pointer-events: none;
          width: calc(960px + 240px);
          z-index: -1;

          // Positioning
          position: absolute;
          top: 0px;
          left: -12px;
          right: auto;
          bottom: 0px;
        }
      }

      &:after {
        background-color: $border;
        height: 1px;

        // Positioning
        position: absolute;
        bottom: 0;
        top: auto;
        left: 0;
        right: 0;
        z-index: 1;
      }
    }
  }
}

.sessions-wrapper {
  background-color: white;
  border-radius: 8px;
  flex-grow: 1;
  margin-top: 20px;
  max-width: 960px;

  @include mobile {
    margin: 0px 1.5em;
  }
}

.columns {
  margin: 0 -0.75rem !important;

  .time-column {
    padding: 0.75rem;
    width: 240px;

    @include mobile {
      width: 100%;
    }
  }
}
*[dir='rtl'] .present:before {
  left: auto !important;
  right: -12px !important;
}
</style>
