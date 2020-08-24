<template>
  <div class="info-panel">
    <div class="info-panel-section">
      <h3 class="section-headings">HOST</h3>
      <p>{{ localeHostOrganisation }}</p>
    </div>
    <div class="info-panel-section">
      <h3 class="section-headings">SPEAKERS</h3>
      <div class="event-speakers">
        <SpeakerRow
          v-for="(speaker, i) in sessionSpeakers"
          :key="i"
          :speaker="speaker"
        />
      </div>
    </div>
    <div class="info-panel-section">
      <h3 class="section-headings">SESSION INFO</h3>
      <p class="icon-and-text">
        <span class="icon">
          <GlobeIcon class="icon-size" />
        </span>
        <span class="session-card-language">
          {{ event.hostLanguage.join('/').toUpperCase() }}
        </span>
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <PlatformIcon class="icon-size" />
          </span>
        </span>
        Info Missing
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <DevicesIcon class="icon-size" />
          </span>
        </span>
        {{ event.attendeeDevices }}
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <RecordIcon class="icon-size" />
          </span>
        </span>
        {{ sessionRecorded }}
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <InteractionIcon class="icon-size" />
          </span>
        </span>
        {{ event.attendeeInteraction }}
      </p>
    </div>

    <div class="info-panel-section">
      <div v-if="slido" class="slido-wrapper embedded">
        <h3 class="section-headings">Slido</h3>
        <div class="enable-poll" v-if="!showPoll">
          <button class="button is-primary" @click="showPoll = true">
            Enable poll
          </button>
        </div>
        <iframe
          v-else
          :src="'https://app.sli.do/event/' + slido.id"
          height="100%"
          width="100%"
          style="min-height: 560px;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { findLink, parseSlidoLink } from '../utils.js'
import SpeakerRow from '@/components/SpeakerRow.vue'
import GlobeIcon from '@/icons/globe.svg'
import DevicesIcon from '@/icons/devices.svg'
import InteractionIcon from '@/icons/interaction.svg'
import RecordIcon from '@/icons/rec.svg'
import PlatformIcon from '@/icons/platform.svg'

import { mapState } from 'vuex'
import marked from 'marked'

export default {
  components: {
    GlobeIcon,
    SpeakerRow,
    PlatformIcon,
    DevicesIcon,
    InteractionIcon,
    RecordIcon
  },
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true },
    language: { type: String, required: true }
  },
  data() {
    return {
      showPoll: false
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'sessions', 'slots', 'speakers']),
    localeTitle() {
      return this.event.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.event.hostOrganisation[this.$i18n.locale]
    },
    sessionRecorded() {
      if (this.event.isRecorded == true) {
        return 'Recorded'
      } else if (this.event.isRecorded == false) {
        return 'Not Recorded'
      } else return 'No Info'
    },
    localeContent() {
      if (this.$i18n.locale === 'dev') return 'event.content'

      const content = this.event?.content?.[this.$i18n.locale]
      return content && marked(content) //marked seems to add <p> tags, not sure why needed
    },
    sessionSpeakers() {
      return this.event.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    slido() {
      const link = findLink(this.event.links, 'poll', this.language)
      return link && parseSlidoLink(link)
    }
  },
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
// .side-panel {
// }

h3 {
  padding-bottom: 1em;
}

.event-speakers > *:not(:last-child) {
  margin-bottom: 1em;
}

.info-panel {
  margin: 1em;
}

.info-panel > *:not(:last-child) {
  margin-bottom: 2em;
}

.slido-wrapper {
  height: 0;
  padding-bottom: percentage(1.5 / 1);

  // > iframe {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  //   height: 100%;
  // }
}

.enable-poll {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
