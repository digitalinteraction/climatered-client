<template>
  <span>
    <div :class="['session-actions', { 'is-fullwidth': isFullwidth }]">
      <div class="flex-spacer"></div>

      <!-- Meta button -->
      <div class="button-wrapper" v-if="isDev">
        <button
          class="button is-modern is-fullwidth is-small"
          @click="metaVisible = !metaVisible"
        >
          Toggle Meta
        </button>
      </div>

      <!-- Add to calendar button -->
      <div class="button-wrapper">
        <div class="buttons has-addons">
          <button
            v-if="isFuture"
            @click="addSessionToCalendar(session, scheduleSlot)"
            class="button is-modern is-purple is-small"
          >
            <span>{{ $t('schedule.addToCalendar') }}</span>
          </button>
          <!-- <button
            v-if="isFuture"
            @click="addSessionToCalendar(session, scheduleSlot)"
            class="button is-modern is-purple is-small"
          >
            <span class="icon is-small">
              <fa :icon="['fas', 'plus']" />
            </span>
          </button> -->
        </div>
      </div>

      <!-- View/join/preview session button -->
      <div v-if="!onSessionPage" class="button-wrapper">
        <router-link :to="session | sessionRoute">
          <button :class="primaryActionClasses">
            {{ $t(primaryAction) }}
          </button>
        </router-link>
      </div>
    </div>
    <div v-if="isDev && metaVisible" class="meta-section">
      <pre>{{ session }}</pre>
    </div>
  </span>
</template>

<script>
// Constants
import { ROUTE_SESSION } from '../../const'

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
    sessionState: { type: String, required: true },
    isFullwidth: { type: Boolean, default: false }
  },
  filters: {
    sessionRoute: e => ({ name: ROUTE_SESSION, params: { sessionId: e.id } })
  },
  data() {
    return {
      metaVisible: false
    }
  },
  computed: {
    onSessionPage() {
      return this.$route.name === ROUTE_SESSION
    },
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
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
          'is-success': this.isPresent
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
  margin-top: -10px;
  justify-content: flex-end;

  min-height: auto;
  padding: 0;
  width: 100%;

  &.is-fullwidth {
    flex-direction: row;

    .button-wrapper {
      flex-grow: 1;
      flex-basis: 100%;
      margin-inline-start: 0;
    }
  }

  .button-wrapper {
    justify-self: end;
    margin-inline-start: 0.75em;
    .buttons {
      .button:first-child {
        flex-grow: 1;
      }
      .button:not(:first-child) {
        border-inline-start: 1px solid rgba($color: #000000, $alpha: 0.2);
        margin-inline-start: 1px;
      }
    }
    .button {
      padding: 0 15px;
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
