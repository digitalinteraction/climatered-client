<template>
  <span class="session-state-tags">
    <!-- Live now -->
    <span
      v-if="sessionState === 'present'"
      class="tag session-state-tag is-danger"
    >
      <fa :icon="['fas', 'circle']" />
      <span>
        {{ $t('session.liveNow') }}
      </span>
    </span>

    <!-- Session ended -->
    <span v-if="sessionState === 'past'" class="tag session-state-tag is-dark">
      <fa :icon="['fas', 'exclamation-triangle']" />
      <span>
        {{ $t('session.sessionEnded') }}
      </span>
    </span>

    <!-- Attendance -->
    <span
      v-if="sessionState === 'soon' || sessionState === 'future'"
      class="tag session-state-tag is-white"
    >
      <span :class="[attendance < 1 ? 'has-text-grey' : 'has-text-danger']">
        <fa :icon="['fas', 'fire']" />
        <span>
          {{
            $t(attendance === 1 ? 'session.person' : 'session.people', [
              attendance
            ])
          }}
        </span>
      </span>
      <span class="has-text-grey is-hidden-mobile mx-1">
        {{ `${$t('session.interestedInSession')}` }}
      </span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'SessionStateTag',
  props: {
    attendance: {
      type: Number,
      required: true
    },
    sessionState: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tag.session-state-tag {
  font-size: 0.8em;
  font-weight: bold;
  padding: 18px;
  text-transform: uppercase;
  svg:first-child {
    margin-inline-end: 10px;
  }
}
</style>
