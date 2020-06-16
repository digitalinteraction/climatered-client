<template>
  <div class="event-countdown">
    <h2 class="heading">Coming soon</h2>

    <div class="content">
      <p>This event hasn't started yet, come back soon!</p>
    </div>

    <div class="notification is-info is-light is-size-3 has-text-centered">
      {{ msUntilStart | friendlyTime }}
    </div>
  </div>
</template>

<script>
import { formatMilliseconds } from 'format-ms'

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
      return formatMilliseconds(timeInMs, { ignore: ['millisecond'] })
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
</style>
