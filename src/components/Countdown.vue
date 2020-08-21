<template>
  <div class="event-countdown">
    <div class="columns event-panels">
      <div class="column is-two-thirds left-event-panel">
        <h2 class="heading">Coming soon</h2>

        <div class="content">
          <p>This event hasn't started yet, come back soon!</p>
        </div>

        <div>
          <button class="button button-style-a">Attend Session</button>
          <button class="button button-style-b">Add to Calendar</button>
        </div>

        <div class="countdown-timer notification is-size-1 has-text-centered">
          {{ msUntilStart | friendlyTime }}
        </div>
      </div>
      <div class="column is-one-third right-event-panel"></div>
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
      msUntilStart: this.timeUntilStart()
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
    }
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

.button-style-a {
  background-color: $button-coloured;
  color: white;
}
.button-style-b {
  background-color: $light-grey;
  color: black;
}

.left-event-panel {
  border-right: 2px solid $light-grey;
}
</style>
