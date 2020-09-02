<template>
  <div class="session-tile">
    <!-- Type -->
    <SessionTileType :session="session" />

    <!-- Title -->
    <router-link :to="session | eventRoute">
      <h2 class="session-title">
        <span class="text">
          {{ localeTitle }}
        </span>
      </h2>
    </router-link>

    <!-- Description -->
    <p class="session-description">
      {{ localeContent | trim(300) }}
    </p>

    <!-- Attributes -->
    <SessionAttributes :session="session" @show-modal="$emit('show-modal')" />

    <!-- Speakers -->
    <SessionSpeakers :session="session" />

    <!-- Actions -->
    <SessionActions
      :schedule-slot="scheduleSlot"
      :session="session"
      :session-state="sessionState"
    />
  </div>
</template>

<script>
// Constants
import { ROUTE_SESSION } from '../../const'

// Components
import SessionTileType from '@/components/Schedule/SessionTileType.vue'
import SessionAttributes from '@/components/Schedule/SessionAttributes.vue'
import SessionSpeakers from '@/components/Schedule/SessionSpeakers.vue'
import SessionActions from '@/components/Schedule/SessionActions.vue'

export default {
  name: 'SessionTile',
  components: {
    SessionTileType,
    SessionAttributes,
    SessionSpeakers,
    SessionActions
  },
  props: {
    scheduleSlot: { type: Object, required: true },
    session: { type: Object, required: true },
    sessionState: { type: String, required: true }
  },
  filters: {
    trim: function(value, length) {
      if (value.length < length) return value
      return `${value.substring(0, length)}...`
    },
    eventRoute: e => ({ name: 'Event', params: { eventId: e.id } })
  },
  computed: {
    routeEvent() {
      return ROUTE_SESSION
    },
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeContent() {
      return this.session.content[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.session.hostOrganisation[this.$i18n.locale]
    }
  }
}
</script>

<style lang="scss" scoped>
$inner-pad: 0.4rem 0.7rem;

.session-tile {
  padding: 20px;
  position: relative;

  &:not(:last-child) {
    &:after {
      content: '';
      background-color: $border;

      // Positioning
      position: absolute;
      height: 1px;
      bottom: -1px;
      left: 20px;
      right: 0px;
    }
  }

  .session-title {
    color: #222;
    max-width: 800px;
    font-size: $size-5;
    font-weight: 900;
    line-height: 20px;
    position: relative;
    padding: 10px 0px;

    .text {
      font-weight: $weight-bold;
    }
    .icon {
      position: absolute;
      top: 0;
      left: -50px;
      height: 40px;
      width: 40px;
      svg.session-icon {
        height: 40px;
        width: 40px;
      }
    }

    &:hover .text {
      text-decoration: underline;
    }
  }

  .session-description {
    color: $cc-bluegrey;
    font-size: 0.9em;
    max-width: 800px;
    position: relative;
  }
}
</style>
