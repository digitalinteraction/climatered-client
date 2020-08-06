<template>
  <div class="session-card" :class="cardClasses">
    <div class="session-card-header">
      <component v-if="typeIcon" :is="typeIcon" class="session-icon" />
      <div class="session-type" v-if="typeTextKey" v-t="typeTextKey" />
    </div>
    <div class="session-card-body">
      <p class="session-title">
        {{ sessionTitle }}
      </p>
      <div class="columns">
        <div class="column">
          <p class="session-info" v-if="session.hostOrganisation">
            {{ $t('sessionCard.hostedBy') }}
            <strong> {{ session.hostOrganisation }} </strong>
          </p>
        </div>
        <div class="column is-narrow">
          <p>
            <GlobeIcon class="globe" />
            <span class="session-card-language">
              {{ session.hostLanguage }}
            </span>
          </p>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div class="session-card-speakers">
            <SpeakerRow
              v-for="(speaker, i) in session.speakers"
              :key="i"
              :speaker="speaker"
            />
          </div>
        </div>
        <div class="column is-narrow" v-if="isOfficial">
          <OfficialIcon />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OfficialIcon from '@/icon/ifrc.svg'
import GlobeIcon from '@/icon/globe.svg'
import SpeakerRow from '@/components/SpeakerRow.vue'

const typeIcons = {}

export default {
  components: { OfficialIcon, GlobeIcon, SpeakerRow },
  props: {
    session: { type: Object, required: true }
  },
  computed: {
    typeIcon() {
      return typeIcons[this.session.type]
    },
    typeTextKey() {
      return `data.type.${this.session.type}`
    },
    cardClasses() {
      return [`is-${this.session.track}`]
    },
    sessionTitle() {
      return this.session.title[this.$i18n.locale]
    },
    isOfficial() {
      return this.session.track === 'official'
    }
  }
}
</script>

<style lang="scss" scoped>
$inner-pad: 0.4rem 0.7rem;

.session-card {
  .session-card-header {
    padding: $inner-pad;
    color: $white;
    font-weight: 800;
    text-transform: uppercase;
    border-top-left-radius: $radius-large;
    border-top-right-radius: $radius-large;
    font-size: $size-7;
  }

  .session-card-body {
    padding: $inner-pad;
    border: 1px solid $border;
    border-top: none;
    border-bottom-left-radius: $radius-large;
    border-bottom-right-radius: $radius-large;
  }

  .session-title {
    font-weight: 900;
  }

  .session-info {
    color: $grey;

    strong {
      color: $black;
      font-weight: bold;
    }
  }

  .session-card-language {
    text-transform: uppercase;
    font-weight: bold;
  }

  .globe {
    height: 0.85em;
    width: 0.85em;
  }

  .session-card-speakers > *:not(:last-child) {
    margin-bottom: 12px;
  }

  &.is-official .session-card-header {
    background-color: $track-official;
  }
  &.is-act .session-card-header {
    background-color: $track-act;
  }
  &.is-empower .session-card-header {
    background-color: $track-empower;
  }
  &.is-influence .session-card-header {
    background-color: $track-influence;
  }
  &.is-transform .session-card-header {
    background-color: $track-transform;
  }
}
</style>
