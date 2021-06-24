<template>
  <span>
    <div
      :class="[
        'session-actions',
        { 'is-fullwidth': isFullwidth, 'is-minimal': isMinimal }
      ]"
    >
      <div class="flex-spacer"></div>

      <!-- Register interest button -->
      <div
        v-if="enabledActions.indexOf('register') !== -1"
        class="button-wrapper"
      >
        <div class="buttons has-addons">
          <a
            @click="toggleInterest"
            :disabled="checkingInterest"
            :class="[
              'button',
              'is-small',
              {
                'is-loading': checkingInterest,
                'is-coral': !checkingInterest && !hasRegisteredInterest,
                'is-success': !checkingInterest && hasRegisteredInterest
              }
            ]"
          >
            <span class="icon">
              <fa
                :icon="
                  hasRegisteredInterest
                    ? ['fas', 'check']
                    : ['fas', 'user-plus']
                "
              />
            </span>
            <span>{{
              hasRegisteredInterest
                ? $t('schedule.actions.interestRegistered')
                : $t('schedule.actions.registerInterest')
            }}</span>
          </a>
        </div>
      </div>

      <!-- Add to calendar button -->
      <div
        v-if="!isPast && enabledActions.indexOf('calendar') !== -1"
        class="button-wrapper"
      >
        <div class="buttons has-addons">
          <a
            v-if="calendarLink"
            :href="calendarLink"
            target="_blank"
            @click="trackCalendar"
            :class="['button', 'is-purple', 'is-small']"
          >
            <span class="icon">
              <fa :icon="['fas', 'calendar-plus']" class="fa-fw fa-xs" />
            </span>
            <span v-if="!isMinimal">{{ $t('schedule.addToCalendar') }}</span>
          </a>
        </div>
      </div>

      <!-- View/join/preview session button -->
      <div v-if="enabledActions.indexOf('view') !== -1" class="button-wrapper">
        <router-link
          :to="sessionRoute"
          :class="[
            'button',
            'is-small',
            'is-fullwidth',
            ...primaryActionClasses
          ]"
        >
          <span v-if="!isMinimal">{{ $t(primaryAction) }}</span>
          <span class="icon rtl-only">
            <fa :icon="['fas', 'arrow-left']" class="fa-fw fa-xs" />
          </span>
          <span class="icon ltr-only">
            <fa :icon="['fas', 'arrow-right']" class="fa-fw fa-xs" />
          </span>
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
import { isStaticSite, getApiUrl } from '@/utils'

// Constants
import { ROUTE_SESSION } from '../../const'

// Mixins
import CalendarMixin from '@/mixins/CalendarMixin.js'

// Icons

export default {
  name: 'SessionActions',
  mixins: [CalendarMixin],
  props: {
    session: { type: Object, required: true },
    sessionState: { type: String, required: true },
    sessionLayout: { type: String, required: false, default: 'unknown' },
    isFullwidth: { type: Boolean, default: false },
    isMinimal: { type: Boolean, default: false },
    enabledActions: {
      type: Array,
      default: () => {
        return ['calendar', 'view', 'register']
      }
    }
  },
  mounted() {
    if (this.onSessionPage) {
      this.checkIfInterestRegistered()
    }
  },
  data() {
    return {
      metaVisible: (() => {
        return this.$route.query.showMeta
      })(),
      hasRegisteredInterest: false,
      checkingInterest: true
    }
  },
  computed: {
    sessionRoute() {
      return {
        name: ROUTE_SESSION,
        params: { sessionSlug: this.session.slug }
      }
    },
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
      if (isStaticSite()) return null
      return getApiUrl(`schedule/ics/${this.session.slug}`)
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
    isSoon() {
      return this.sessionState === 'soon'
    },
    isPresent() {
      return this.sessionState === 'present'
    },
    isFuture() {
      return this.sessionState === 'future'
    },
    primaryActionClasses() {
      return {
        'is-success': this.isPresent || this.isPast
      }
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
    async checkIfInterestRegistered() {
      const result = await this.$store.dispatch('api/checkAttendence', {
        sessionSlug: this.session.slug
      })
      this.hasRegisteredInterest = result.data.isAttending
      this.checkingInterest = false
    },
    toggleInterest() {
      this.checkingInterest = true

      if (this.hasRegisteredInterest) {
        this.unregisterInterest()
      } else {
        this.registerInterest()
      }
    },
    async registerInterest() {
      // TODO: Enable for production
      // if (this.sessionLayout === 'room') {
      //   document.location = this.registerInterestLink
      // }
      setTimeout(async () => {
        // Register attendence
        await this.$store.dispatch('api/registerAttendence', {
          sessionSlug: this.session.slug
        })

        this.hasRegisteredInterest = true
        this.checkingInterest = false
        this.checkIfInterestRegistered()
      }, 500)
    },
    async unregisterInterest() {
      setTimeout(async () => {
        // Unregister attendence
        await this.$store.dispatch('api/unregisterAttendence', {
          sessionSlug: this.session.slug
        })

        this.hasRegisteredInterest = false
        this.checkingInterest = false
        this.checkIfInterestRegistered()
      }, 500)
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

  &.is-minimal {
    .button {
      .icon {
        margin-left: 0px !important;
        margin-right: 0px !important;
      }
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
