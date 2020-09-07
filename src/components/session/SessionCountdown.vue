<template>
  <div
    id="event-countdown"
    class="columns is-gapless is-mobile is-centered has-text-centered"
  >
    <div class="column" v-if="!loading && countdownHours > 0">
      <div class="countdown-value">{{ countdownHours }}</div>
      <div class="countdown-label">
        {{
          countdownHours === 1
            ? $t('session.countdown.hour')
            : $t('session.countdown.hours')
        }}
      </div>
    </div>
    <div class="column" v-if="!loading && countdownMinutes > 0">
      <div class="countdown-value">{{ countdownMinutes }}</div>
      <div class="countdown-label">
        {{
          countdownMinutes === 1
            ? $t('session.countdown.minute')
            : $t('session.countdown.minutes')
        }}
      </div>
    </div>
    <div class="column" v-if="!loading">
      <div class="countdown-value">{{ countdownSeconds }}</div>
      <div class="countdown-label">
        {{
          countdownSeconds === 1
            ? $t('session.countdown.second')
            : $t('session.countdown.seconds')
        }}
      </div>
    </div>
    <div class="column" v-else>
      <div class="countdown-label">{{ $t('general.loading') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SessionCountdown',
  props: {
    session: { type: Object, required: true },
    scheduleSlot: { type: Object, required: true }
  },
  data() {
    return {
      loading: true,
      countdownHours: 0,
      countdownMinutes: 0,
      countdownSeconds: 0
    }
  },
  computed: {
    language() {
      return this.$i18n.locale
    },
    url() {
      return 'www.google.com'
    },
    organizer() {
      return this.session.hostOrganisation[this.$i18n.locale]
    },
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    begin() {
      return this.$options.filters.localeDateTime(this.scheduleSlot.start)
    },
    stop() {
      return this.$options.filters.localeDateTime(this.scheduleSlot.end)
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.timeUntilStart()
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    timeUntilStart() {
      let remaining = new Date(this.scheduleSlot.start).getTime() - Date.now()

      // Remaining hours
      this.countdownHours = parseInt(remaining / 3600000)
      remaining = remaining - this.countdownHours * 3600000

      // Remaining minutes
      this.countdownMinutes = parseInt(remaining / 60000)
      remaining = remaining - this.countdownMinutes * 60000

      // Remaining seconds
      this.countdownSeconds = parseInt(remaining / 1000)
      remaining = remaining - this.countdownSeconds * 1000

      this.loading = false
    },
    addCal() {
      this.$ics.addsession(
        this.language,
        this.localeTitle,
        null,
        null,
        this.begin,
        this.stop,
        this.url,
        this.organizer
      )

      this.$ics.download(this.localeTitle)
    },
    attendSession() {}
  }
}
</script>

<style lang="scss" scoped>
#event-countdown {
  border-radius: $radius;
  background: $cc-green;
  padding: 0.75rem;

  .countdown-value {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    line-height: 2rem;
    padding: 0 15px;
  }

  .countdown-label {
    color: white;
    font-size: 0.8em;
    padding: 0 15px;
    text-transform: uppercase;
  }
}
</style>
