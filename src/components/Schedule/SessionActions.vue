<template>
  <span>
    <div class="session-actions">
      <div class="flex-spacer"></div>

      <!-- Meta button -->
      <!-- <div class="button-wrapper">
        <button
          class="button is-modern is-fullwidth is-small"
          @click="metaVisible = !metaVisible"
        >
          Toggle Meta
        </button>
      </div> -->

      <!-- Add to calendar button -->
      <div class="button-wrapper">
        <button
          v-if="isFuture"
          @click="addSessionToCalendar(session, scheduleSlot)"
          class="button is-modern is-purple is-fullwidth is-small"
        >
          <span>{{ $t('schedule.addToCalendar') }}</span>
        </button>
      </div>

      <!-- View/join/preview session button -->
      <div class="button-wrapper">
        <router-link :to="session | eventRoute">
          <button :class="primaryActionClasses">
            {{ $t(primaryAction) }}
          </button>
        </router-link>
      </div>
    </div>
    <div v-if="metaVisible" class="meta-section">
      <pre>{{ session }}</pre>
    </div>
  </span>
</template>

<script>
// Mixins
import CalendarMixin from '@/mixins/CalendarMixin.js'

// Icons
// import CalendarIcon from '@/icons/calendar.svg'

export default {
  name: 'SessionActions',
  mixins: [CalendarMixin],
  components: {
    // CalendarIcon
  },
  props: {
    scheduleSlot: { type: Object, required: true },
    session: { type: Object, required: true },
    sessionState: { type: String, required: true }
  },
  filters: {
    eventRoute: e => ({ name: 'Event', params: { eventId: e.id } })
  },
  data() {
    return {
      metaVisible: false
    }
  },
  computed: {
    isPast() {
      return this.sessionState === 'past'
    },
    isPresent() {
      return this.sessionState === 'present'
    },
    isFuture() {
      return this.sessionState === 'future'
    },
    primaryActionClasses() {
      return [
        'button',
        'is-modern',
        'is-fullwidth',
        'is-small',
        {
          'is-success': this.isPresent,
          'is-light': this.isPast || this.isFuture
        }
      ]
    },
    primaryAction() {
      switch (this.sessionState) {
        case 'past': {
          return 'schedule.actions.viewSession'
        }
        case 'present': {
          return 'schedule.actions.joinSession'
        }
        case 'future': {
          return 'schedule.actions.previewSession'
        }
        default: {
          return 'schedule.actions.viewSession'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.session-actions {
  // Flex
  display: flex;
  flex-direction: column;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-end;
  justify-content: end;

  min-height: auto;
  padding: 0;
  width: 100%;

  .button-wrapper {
    justify-self: end;
    margin-inline-start: 0.75em;
    .button {
      padding: 0 30px;
    }
    &:not(:first-child) {
      margin-top: 10px;
    }
    @include mobile {
      flex-grow: 1;
      flex-basis: 100%;
      margin-inline-start: 0;
    }
  }

  .flex-spacer {
    flex-grow: 1;
    @include mobile {
      flex-grow: 0;
    }
  }
}
.meta-section {
  background-color: $cc-lightergrey;
  border-radius: 8px;
  margin-top: 20px;
  overflow: hidden;
}
</style>
