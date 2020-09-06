<template>
  <div :class="['schedule-slot-time', { 'is-padded': isPadded }]">
    <!-- NOW tag -->
    <div class="state-tag present" v-if="isPresent && !onSessionPage">
      {{ $t('schedule.now') }}
    </div>

    <!-- PAST tag -->
    <div class="state-tag past" v-if="isPast">
      {{ $t('schedule.past') }}
    </div>

    <!-- Time label -->
    <h3>
      <span :title="new Date(scheduleSlot.start)">
        {{ scheduleSlot.start | localeTimeShort }}
      </span>
      <!-- <span>
        -
      </span> -->
      <fa :icon="['fas', 'long-arrow-alt-right']" class="fa-xs" />
      <fa
        :icon="['fas', 'long-arrow-alt-right']"
        class="fa-xs fa-flip-horizontal"
      />
      <span :title="new Date(scheduleSlot.end)">
        {{ scheduleSlot.end | localeTimeShort }}
      </span>
    </h3>

    <!-- Timezone label -->
    <h4>
      <span>{{ currentTimeZone }}</span>
      <span> ({{ currentTimeZoneAbbr }})</span>
    </h4>

    <!-- Date label -->
    <h5>{{ scheduleSlot.start | localeDateShort }}</h5>
  </div>
</template>

<script>
import { getTimeZone } from '../../utils'

// Constants
import { ROUTE_SESSION } from '../../const'

export default {
  name: 'ScheduleSlotTime',
  props: {
    currentTime: {
      type: Number,
      required: true
    },
    scheduleSlot: {
      type: Object,
      required: true
    },
    isPadded: {
      type: Boolean,
      default: false
    },
    forceActiveSessionState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTimeZone: getTimeZone(),
      currentTimeZoneAbbr: getTimeZone(true)
    }
  },
  computed: {
    onSessionPage() {
      return this.$route.name === ROUTE_SESSION
    },
    isPast() {
      return this.stateForSlot === 'past'
    },
    isPresent() {
      return this.stateForSlot === 'present'
    },
    isFuture() {
      return this.stateForSlot === 'future'
    },
    stateForSlot() {
      if (this.forceActiveSessionState) return 'present'

      const start = new Date(this.scheduleSlot.start).getTime()
      const end = new Date(this.scheduleSlot.end).getTime()

      if (this.currentTime < start) return 'future'
      if (this.currentTime > end) return 'past'
      if (this.currentTime > start && this.currentTime < end) return 'present'

      return 'unknown'
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-slot-time {
  letter-spacing: 0.05em;
  min-width: 260px;

  // Positioning
  position: sticky;
  left: 0;
  right: 0;
  z-index: 1;
  top: $navbar-height + 2.5rem;

  &.is-padded {
    padding: 15px 40px;

    @include tablet {
      padding: 30px;
    }

    @include mobile {
      padding: 15px;
    }
  }

  @include mobile {
    display: block;
    width: auto;
    min-width: 100%;
    // text-align: center;
  }

  .state-tag {
    border-radius: 8px;
    display: inline-block;
    font-size: 0.7em;
    font-weight: bold;
    margin-bottom: 5px;
    padding: 2px 20px;
    text-align: center;
    text-transform: uppercase;

    &.present {
      background-color: $cc-red;
      color: white;
    }
    &.past {
      background-color: #ddd;
      color: #999;
    }
  }

  h3 {
    color: $cc-black;
    font-size: 1.3em;
    font-weight: $weight-bold;
    line-height: 1.5rem;
  }
  h4 {
    color: #757a8a;
    font-size: 0.9em;
    font-weight: $weight-bold;
    line-height: 1.25rem;
  }
  h5 {
    color: $text-light;
    color: #999;
    font-size: 0.9em;
    font-weight: $weight-normal;
  }

  &.is-large {
    h3 {
      font-size: 1.5em;
    }
    h4 {
      font-size: 1.1em;
    }
    h5 {
      font-size: 1.1em;
    }
  }
}

// RTL support
*[dir='ltr'] {
  .schedule-slot-time {
    svg:not(.fa-flip-horizontal) {
      display: inline-block;
    }
    svg.fa-flip-horizontal {
      display: none;
    }
  }
}
*[dir='rtl'] {
  .schedule-slot-time {
    svg:not(.fa-flip-horizontal) {
      display: none;
    }
    svg.fa-flip-horizontal {
      display: inline-block;
    }
  }
}
</style>
