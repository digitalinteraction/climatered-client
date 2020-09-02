<template>
  <AppWrapper>
    <div class="session-detail">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="session-panel">
            <div class="buttons">
              <router-link
                class="session-back button is-text"
                :to="scheduleRoute"
              >
                {{ $t('general.backTo', [$t('schedule.title')]) }}
              </router-link>
            </div>

            <div class="columns">
              <div class="column">
                <p class="session-headings">
                  {{ slot.start | localeDate }}
                  {{ slot.start | localeTime }} &ndash;
                  {{ slot.end | localeTime }} &ndash;
                  <span class="icon" v-if="sessionTypeIcon">
                    <component :is="sessionTypeIcon" class="icon-size" />
                  </span>
                  <span class="session-type" v-if="localeType">
                    {{ localeType.toUpperCase() }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Session abstract -->
            <div
              class="session-abstract"
              :class="{ 'hide-overflow': !readMore }"
            >
              <div class="content" v-html="localeContent"></div>
            </div>

            <!-- Session interaction -->
            <div class="buttons is-centered">
              <p class="button is-text" @click="readMore = !readMore">
                <span v-t="readMore ? 'session.seeLess' : 'session.seeMore'" />
              </p>
            </div>

            <!-- Session view -->
            <component
              v-if="sessionComponent"
              :is="sessionComponent"
              :session="session"
              :session-slot="slot"
            />
          </div>
        </div>
        <div class="column is-one-third session-sidebar">
          <SessionSidePanel :session="session" :slot-state="slotState" />
        </div>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'

import { ROUTE_SCHEDULE } from '@/const'
import SessionSidePanel from '@/components/SessionSidePanel.vue'
import Countdown from '@/components/Countdown.vue'
import OneToMany from '@/components/OneToMany.vue'
import ManyToMany from '@/components/ManyToMany.vue'
import AppWrapper from '@/components/AppWrapper.vue'
import Stack from '@/components/Stack.vue'

import GamesIcon from '@/icons/types/games.svg'
import KeynoteIcon from '@/icons/types/keynote.svg'
import PanelIcon from '@/icons/types/panel.svg'
import VirtualIcon from '@/icons/types/virtual.svg'
import OfficialIcon from '@/icons/ifrc.svg'
import GlobeIcon from '@/icons/globe.svg'
import AttendeeIcon from '@/icons/attendee.svg'

const sessionComponents = {
  plenary: OneToMany,
  panel: OneToMany
}

const typeIcons = {
  'games.svg': GamesIcon,
  'keynote.svg': KeynoteIcon,
  'panel.svg': PanelIcon,
  'virtual.svg': VirtualIcon
}

export default {
  components: {
    OfficialIcon,
    GlobeIcon,
    AttendeeIcon,
    SessionSidePanel,
    AppWrapper,
    Stack
  },
  props: {
    sessionId: { type: String, required: true }
  },
  data() {
    return {
      slotState: 'active',
      readMore: false,
      scheduleRoute: { name: ROUTE_SCHEDULE }
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'slots', 'speakers']),
    session() {
      return this.$store.getters['api/session'](this.sessionId)
    },
    slot() {
      return this.session && this.$store.getters['api/slot'](this.session.slot)
    },
    sessionType() {
      return this.session && this.$store.getters['api/type'](this.session.type)
    },
    sessionTypeIcon() {
      return typeIcons[this.sessionType?.icon ?? 'keynote.svg']
    },
    localeType() {
      return this.sessionType?.title[this.$i18n.locale]
    },
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.session.hostOrganisation[this.$i18n.locale]
    },
    localeContent() {
      if (this.$i18n.locale === 'dev') return '{{session.content}}'

      const content = this.session?.content?.[this.$i18n.locale]
      return content && marked(content)
    },
    sessionSpeakers() {
      return this.session?.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    sessionComponent() {
      if (!this.session || !this.slotState) return null
      if (this.slotState === 'before') return Countdown
      return sessionComponents[this.session.type] ?? ManyToMany
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      // ...
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    changeState() {
      // ...
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-size {
  height: 1em;
  width: 1em;
}

.session-panel {
  padding: 2rem 1rem;
}

.session-headings {
  color: $cc-light-blue;
  font-weight: bold;
  text-transform: uppercase;
}

.session-back {
  padding-inline-start: 0;
}

.session-abstract.hide-overflow {
  max-height: 120px;
  overflow-y: hidden;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow: 0 -2em 1em -1em white inset;
  }
}

.session-sidebar {
  border-inline-start: 1px solid $border;
}
</style>
