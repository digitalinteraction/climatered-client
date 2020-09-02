<template>
  <div class="session-tile">
    <!-- Type -->
    <SessionType :session="session" />

    <!-- Title -->
    <router-link :to="session | sessionRoute">
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
    <SessionSpeakers :session="session" :is-padded="true" />

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
import { ROUTE_SESSION } from '../const'

// Components
import SessionType from '@/components/session/SessionType.vue'
import SessionAttributes from '@/components/session/SessionAttributes.vue'
import SessionSpeakers from '@/components/session/SessionSpeakers.vue'
import SessionActions from '@/components/session/SessionActions.vue'

export default {
  name: 'SessionTile',
  components: {
    SessionType,
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
    sessionRoute: e => ({ name: ROUTE_SESSION, params: { sessionId: e.id } })
  },
  computed: {
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
