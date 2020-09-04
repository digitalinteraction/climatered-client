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
          Toggle meta
        </button>
      </div>

      <!-- Register interest button -->
      <div class="button-wrapper" v-if="onSessionPage && isFuture">
        <div class="buttons has-addons">
          <button
            @click="registerInterest"
            class=""
            :class="[
              'button',
              'has-icon',
              'is-modern',
              'is-small',
              {
                'is-coral': !hasRegisteredInterest,
                'is-success': hasRegisteredInterest
              }
            ]"
          >
            <fa
              :icon="
                hasRegisteredInterest ? ['fas', 'check'] : ['fas', 'user-plus']
              "
              class="icon fa-fw fa-xs"
            />
            <span>{{
              hasRegisteredInterest
                ? $t('schedule.actions.interestRegistered')
                : $t('schedule.actions.registerInterest')
            }}</span>
          </button>
        </div>
      </div>

      <!-- Add to calendar button -->
      <div class="button-wrapper" v-if="isFuture">
        <div class="buttons has-addons">
          <a
            :href="calendarLink"
            target="_blank"
            @click="trackCalendar"
            class="button has-icon is-modern is-purple is-small"
          >
            <fa :icon="['fas', 'calendar-plus']" class="icon fa-fw fa-xs" />
            <span>{{ $t('schedule.addToCalendar') }}</span>
          </a>
        </div>
      </div>

      <!-- View/join/preview session button -->
      <div v-if="!onSessionPage" class="button-wrapper">
        <router-link :to="session | sessionRoute" :class="primaryActionClasses">
          {{ $t(primaryAction) }}
        </router-link>
      </div>
    </div>
    <div v-if="isDev && metaVisible" class="meta-section">
      <pre>{{ sessionLayout }}</pre>
      <pre>{{ session }}</pre>
    </div>
  </span>
</template>

<script>
import { pickApi } from '@/utils'

// Constants
import { ROUTE_SESSION } from '../../const'

// Mixins
import CalendarMixin from '@/mixins/CalendarMixin.js'

// Icons

export default {
  name: 'SessionActions',
  mixins: [CalendarMixin],
  props: {
    scheduleSlot: { type: Object, required: true },
    session: { type: Object, required: true },
    sessionState: { type: String, required: true },
    sessionLayout: { type: String, required: false, default: 'unknown' },
    isFullwidth: { type: Boolean, default: false }
  },
  filters: {
    sessionRoute: s => ({
      name: ROUTE_SESSION,
      params: { sessionSlug: s.slug }
    })
  },
  data() {
    return {
      metaVisible: false,
      hasRegisteredInterest: false
    }
  },
  computed: {
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    registerInterestLink() {
      const emailSubject = this.$t('schedule.actions.registerInterestSubject')
      const emailRecipient = this.session.hostEmail
      const emailBody = this.$t('schedule.actions.registerInterestBody', [
        this.localeTitle
      ])
      const emailCCRecipient = 'support@climate.red'

      return `mailto:${emailRecipient}?cc=${emailCCRecipient}&subject=${emailSubject}&body=${emailBody}`
    },
    calendarLink() {
      return `${pickApi()}schedule/ics/${this.session.slug}`
    },
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
  },
  methods: {
    async registerInterest() {
      // TODO: Enable for production
      // if (this.sessionLayout === 'room') {
      //   document.location = this.registerInterestLink
      // }

      // Increment attendence
      await this.$store.dispatch('api/registerAttendence', {
        sessionSlug: this.session.slug
      })
      this.hasRegisteredInterest = true
    },
    trackCalendar() {
      this.$gtag.event('ical', {
        event_category: this.session.slug,
        event_label: 'ical downloaded',
        value: 0
      })
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
      .button {
        flex-grow: 1;
      }
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
