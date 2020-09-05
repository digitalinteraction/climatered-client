<template>
  <div id="event-countdown" class="has-text-centered">
    {{ msUntilStart | friendlyTime }}
  </div>
</template>

<script>
import countdown from 'countdown'

export default {
  name: 'SessionCountdown',
  props: {
    session: { type: Object, required: true },
    scheduleSlot: { type: Object, required: true }
  },
  data() {
    return {
      msUntilStart: this.timeUntilStart()
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
  filters: {
    friendlyTime(timeInMs) {
      const units = countdown.HOURS | countdown.MINUTES | countdown.SECONDS

      return countdown(Date.now(), Date.now() + timeInMs, units).toString()
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.msUntilStart = this.timeUntilStart()
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    timeUntilStart() {
      return new Date(this.scheduleSlot.start).getTime() - Date.now()
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
  color: white;
  font-weight: bold;
  padding: 15px;
}
</style>
