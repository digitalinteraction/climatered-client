<template>
  <div class="session-card" :class="cardClasses">
    <div class="session-card-header icon-and-text">
      <span class="icon" v-if="typeIcon">
        <component :is="typeIcon" class="session-icon" />
      </span>
      <span class="session-type" v-if="localeType">{{ localeType }}</span>
    </div>
    <div class="session-card-body">
      <p class="session-title">
        {{ localeTitle }}
      </p>
      <div class="columns">
        <div class="column">
          <p class="session-info" v-if="localeHostOrganisation">
            {{ $t('sessionCard.hostedBy') }}
            <strong> {{ localeHostOrganisation }} </strong>
          </p>
        </div>
        <div class="column is-narrow">
          <p class="icon-and-text">
            <span class="icon">
              <GlobeIcon class="globe" />
            </span>
            <span class="session-card-language">
              {{ session.hostLanguage.join('/') }}
            </span>
          </p>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div class="session-card-speakers">
            <SpeakerRow
              v-for="(speaker, i) in sessionSpeakers"
              :key="i"
              :speaker="speaker"
            />
          </div>
        </div>
      </div>
      <div class="official-mark" v-if="session.isOfficial">
        <OfficialIcon />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OfficialIcon from '@/icons/ifrc.svg'
import GlobeIcon from '@/icons/globe.svg'
import SpeakerRow from '@/components/SpeakerRow.vue'

import GamesIcon from '@/icons/types/games.svg'
import KeynoteIcon from '@/icons/types/keynote.svg'
import PanelIcon from '@/icons/types/panel.svg'
import VirtualIcon from '@/icons/types/virtual.svg'

const typeIcons = {
  'games.svg': GamesIcon,
  'keynote.svg': KeynoteIcon,
  'panel.svg': PanelIcon,
  'virtual.svg': VirtualIcon
}

export default {
  components: { OfficialIcon, GlobeIcon, SpeakerRow },
  props: {
    session: { type: Object, required: true }
  },
  computed: {
    ...mapState('api', ['speakers']),
    sessionType() {
      return this.$store.getters['api/type'](this.session.type)
    },
    typeIcon() {
      return this.sessionType && typeIcons[this.sessionType.icon]
    },
    localeType() {
      return this.sessionType?.title[this.$i18n.locale]
    },
    cardClasses() {
      const track = this.session.isOfficial ? 'official' : this.session.track
      return [`is-${track}`]
    },
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.session.hostOrganisation[this.$i18n.locale]
    },
    sessionSpeakers() {
      const idSet = new Set(this.session.speakers)
      return this.speakers.filter(s => idSet.has(s.slug))
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
    height: 0.9em;
    width: 0.9em;
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

.icon-and-text {
  display: flex;
  align-items: center;
}

.official-mark {
  display: flex;
  justify-content: flex-end;
}
</style>
