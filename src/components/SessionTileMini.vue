<template>
  <div class="session-tile-mini" @click="viewSession()">
    <div v-if="sessionState === 'present'" class="tag is-small is-pink">
      {{ $t('session.liveNow') }}
    </div>

    <div
      v-if="sessionState === 'future' && timeUntilLive"
      class="tag is-small is-grey"
    >
      {{ $t('atrium.liveIn', [timeUntilLive]) }}
    </div>

    <!-- <SessionType v-else :session="session" classes="is-small" /> -->

    <!-- Title -->
    <h2 class="session-title">
      {{ localeTitle }}
    </h2>

    <div class="level is-mobile">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <div class="has-text-grey is-size-6">
            {{ scheduleSlot.start | localeTimeShort }}
            <!-- <fa :icon="['fas', 'long-arrow-alt-right']" class="fa-fw fa-xs" /> -->
            <!-- {{ scheduleSlot.end | localeTimeShort }} -->
            {{ timeZoneAbbr }}
            {{ scheduleSlot.start | localeDateShort }}
          </div>
        </div>
      </div>
      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <!-- Actions -->
          <SessionActions
            :schedule-slot="scheduleSlot"
            :session="session"
            :session-state="sessionState"
            :is-minimal="true"
            :enabled-actions="['view']"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTimeZone } from '@/utils'
import { mapGetters } from 'vuex'
import countdown from 'countdown'

// Mixins
import SessionTileMixin from '@/mixins/SessionTileMixin.js'

// Components
import SessionActions from '@/components/session/SessionActions.vue'

export default {
  name: 'SessionTileMini',
  mixins: [SessionTileMixin],
  components: {
    SessionActions
  },
  props: {
    session: {
      type: Object,
      required: true
    },
    currentTime: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters('api', ['slot']),
    scheduleSlot() {
      let slot = this.session.slot
      slot.start = this.$route.query.start || slot.start
      slot.end = this.$route.query.end || slot.end
      return slot
    },
    timeZoneAbbr() {
      return getTimeZone(true)
    },
    sessionState() {
      if (this.scheduleSlot) {
        let start = new Date(this.scheduleSlot.start).getTime()
        let end = new Date(this.scheduleSlot.end).getTime()

        const offset = 3600000 // One hour

        if (this.currentTime < start && this.currentTime > start - offset)
          return 'soon'

        if (this.currentTime < start) return 'future'
        if (this.currentTime > end) return 'past'
        return 'present'
      }
      return 'unknown'
    },
    timeUntilLive() {
      if (!this.scheduleSlot) {
        return undefined
      }
      const timeInMs =
        new Date(this.scheduleSlot.start).getTime() - this.currentTime

      if (this.$i18n.locale === 'fr') {
        countdown.setLabels(
          ' | | minute| heure| | | | | | | |',
          ' | | minutes| heures| | | | | | | |',
          ' et ',
          ', ',
          'maintenant'
        )
      }

      if (this.$i18n.locale === 'es') {
        countdown.setLabels(
          ' | | minuto| hora| | | | | | | |',
          ' | | minutos| horas| | | | | | | |',
          ' y ',
          ', ',
          'ahora'
        )
      }

      if (this.$i18n.locale === 'ar') {
        countdown.setLabels(
          ' | | دقيقة| ساعة| | | | | | | |',
          ' | | الدقائق| ساعات| | | | | | | |',
          ' و ',
          ', ',
          'الآن'
        )
      }

      const remaining = countdown(
        Date.now() + timeInMs,
        Date.now(),
        countdown.HOURS | countdown.MINUTES
      ).toString()
      return remaining
    },
    primaryAction() {
      switch (this.sessionState) {
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
    viewSession() {
      this.$router.push(this.sessionRoute)
    }
  }
}
</script>

<style lang="scss" scoped>
.session-tile-mini {
  position: relative;
  .tag {
    font-weight: bold;
    text-transform: uppercase;
  }
  .session-title {
    color: #222;
    max-width: 800px;
    font-size: 1.1em;
    font-weight: $weight-bold;
    line-height: 20px;
    margin: 5px 0 10px 0;
    position: relative;
    padding: 0px 0px;
  }
  &:hover {
    cursor: pointer;
    .session-title {
      text-decoration: underline;
    }
  }
}
</style>
