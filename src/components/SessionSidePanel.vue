<template>
  <div class="session-sidepanel">
    <div class="sidepanel-section">
      <h3 class="sidepanel-heading" v-t="'session.hostHeading'" />
      <p>{{ localeHostOrganisation }}</p>
    </div>
    <div class="sidepanel-section" v-if="sessionSpeakers.length > 0">
      <h3 class="sidepanel-heading" v-t="'session.speakerHeading'" />
      <div class="session-speakers">
        <SpeakerRow
          v-for="(speaker, i) in sessionSpeakers"
          :key="i"
          :speaker="speaker"
        />
      </div>
    </div>
    <div class="sidepanel-section">
      <h3 class="sidepanel-heading" v-t="'session.infoHeading'" />
      <p class="icon-and-text">
        <span class="icon">
          <GlobeIcon class="icon-size" />
        </span>
        <span class="session-card-language is-uppercase">
          {{ session.hostLanguage.join('/') }}
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
        {{ $t(`data.devices.${session.attendeeDevices}`) }}
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <RecordIcon class="icon-size" />
          </span>
        </span>
        {{ $t(`data.recorded.${session.isRecorded}`) }}
      </p>
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <InteractionIcon class="icon-size" />
          </span>
        </span>
        {{ $t(`data.interaction.${session.attendeeInteraction}`) }}
      </p>
    </div>
    <div class="sidepanel-section" v-if="hasNonVideoLinks">
      <h3 class="sidepanel-heading " v-t="'session.linksHeading'" />
      <div class="table-container">
        <table class="table is-bordered">
          <tr v-for="(link, i) in nonVideoLinks" :key="i">
            <td class="table-heading-column">{{ link.type }}</td>
            <td class="table-data">
              <a :href="link.url" target="_blank">{{
                link.title ? link.title : link.url
              }}</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="sidepanel-section">
      <div v-if="slido && slotState == 'active'" class="slido-wrapper embedded">
        <div class="enable-poll" v-if="!showPoll">
          <button class="button is-primary" @click="showPoll = true">
            {{ $t('session.showPoll') }}
          </button>
        </div>
        <iframe
          v-else
          :src="slido.url"
          height="100%"
          width="100%"
          style="min-height: 560px;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { findLink, parseSlidoLink, getTranslation } from '@/utils'
import SpeakerRow from '@/components/SpeakerRow.vue'
import GlobeIcon from '@/icons/globe.svg'
import DevicesIcon from '@/icons/devices.svg'
import InteractionIcon from '@/icons/interaction.svg'
import RecordIcon from '@/icons/rec.svg'
import PlatformIcon from '@/icons/platform.svg'
import { mapState } from 'vuex'

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
    session: { type: Object, required: true },
    slotState: { type: String, required: true }
  },
  data() {
    return {
      showPoll: false
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'sessions', 'slots', 'speakers']),
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return getTranslation(this.session.hostOrganisation, [
        this.$i18n.locale,
        'en'
      ])
    },
    sessionSpeakers() {
      return this.session.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    slido() {
      const link = findLink(this.session.links, 'poll', this.$i18n.locale)
      return link && parseSlidoLink(link)
    },
    nonVideoLinks() {
      return this.session.links.filter(link => {
        return link.type !== 'video' && link.type !== 'poll'
      })
    },
    hasNonVideoLinks() {
      return !!this.nonVideoLinks.length > 0
    }
  },
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.session-sidepanel {
  height: 100%;
  min-height: 100%;
  margin: 1em 0;
}

.session-speakers > *:not(:last-child) {
  margin-bottom: 1em;
}

.sidepanel-section {
  margin-bottom: 2em;
}

.slido-wrapper {
  height: 0;
  padding-bottom: percentage(1.5 / 1);
}

.sidepanel-heading {
  color: $cc-light-blue;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 0.5em;
}

.enable-poll {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
}

.icon-size {
  height: 1em;
  width: 1em;
}

.table-container {
  display: inline-block;
  overflow: auto;
}
.table-heading-column {
  background: $grey-lighter;
}
td {
  font-weight: bold;
  color: $cc-black;
}

.link-container {
  width: 100%;
  overflow-x: scroll;
}
</style>
