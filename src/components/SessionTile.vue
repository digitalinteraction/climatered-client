<template>
  <div class="session-tile">
    <!-- Type -->
    <SessionType :session="session" />

    <!-- Title -->
    <router-link :to="sessionRoute">
      <h2 class="session-title">
        <span class="text">
          {{ localeTitle }}
        </span>
      </h2>
    </router-link>

    <!-- Description -->
    <p class="session-description">
      <span v-if="session.content[$i18n.locale] === '-'">
        {{ $t('session.sessionWillBeHostedIn') }}
        <span class="is-uppercase">
          {{ session.hostLanguage.join('/') }}
        </span>
      </span>
      <span v-else>
        {{ localeContent | trim(300) }}
      </span>
    </p>

    <!-- Attributes -->
    <SessionAttributes :session="session" @show-modal="$emit('show-modal')" />

    <!-- Speakers -->
    <SessionSpeakers
      :session="session"
      :is-padded="true"
      :is-interactive="true"
    />

    <!-- Actions -->
    <SessionActions
      :schedule-slot="scheduleSlot"
      :session="session"
      :session-state="sessionState"
      :enabled-actions="['calendar', 'view']"
    />
  </div>
</template>

<script>
// Mixins
import SessionTileMixin from '@/mixins/SessionTileMixin.js'

// Components
import SessionType from '@/components/session/SessionType.vue'
import SessionAttributes from '@/components/session/SessionAttributes.vue'
import SessionSpeakers from '@/components/session/SessionSpeakers.vue'
import SessionActions from '@/components/session/SessionActions.vue'

export default {
  name: 'SessionTile',
  mixins: [SessionTileMixin],
  components: {
    SessionType,
    SessionAttributes,
    SessionSpeakers,
    SessionActions
  },
  props: {
    scheduleSlot: { type: Object, required: true },
    sessionState: { type: String, required: true }
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
    font-weight: $weight-bold;
    line-height: 20px;
    position: relative;
    padding: 10px 0px;

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
