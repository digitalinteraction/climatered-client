<template>
  <div class="event-countdown">
    <div class="countdown-timer notification is-size-1 has-text-centered">
      {{ msUntilStart | friendlyTime }}
    </div>
    <div>
      <button class="button is-link" @click="attendSession">
        Attend Session
      </button>
      <button class="button is-link" @click="addCal">
        Add to Calendar
      </button>
    </div>
  </div>
</template>

<script>
import countdown from 'countdown'

export default {
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true }
  },
  data() {
    return {
      msUntilStart: this.timeUntilStart(),
      language: this.$i18n.locale,
      url: 'www.google.com',
      organizer: this.event.hostOrganisation[this.$i18n.locale]
    }
  },
  computed: {
    localeTitle() {
      return this.event.title[this.$i18n.locale]
    },
    begin() {
      return this.$options.filters.localeDateTime(this.eventSlot.start)
    },
    stop() {
      return this.$options.filters.localeDateTime(this.eventSlot.end)
    }
  },
  filters: {
    friendlyTime(timeInMs) {
      return countdown(Date.now() + timeInMs).toString()
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
      return new Date(this.eventSlot.start).getTime() - Date.now()
    },
    addCal() {
      console.log(this.event)
      console.log(this.eventSlot)
      console.log(this.language)
      this.$ics.addEvent(
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
.event-countdown {
  //
}

.countdown-timer {
  margin-top: 0.5em;
}

.button {
  font-weight: 300;
  margin-right: 1em;
  border-radius: 10px;
}

.left-event-panel {
  border-inline-end: 2px solid $grey-lighter;
}

.right-event-panel {
  border-inline-end: 2px solid $grey-lighter;
}
</style>
