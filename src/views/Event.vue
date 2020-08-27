<template>
  <AppWrapper>
    <section class="section">
      <div class="container">
        <div class="columns event-panels">
          <div class="column is-two-thirds left-event-panel">
            <div class="level">
              <router-link class="back-button is-text" to="/prototype"
                >&lt; Back</router-link
              >
            </div>
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <p class="section-headings">
                    {{ slot.start | localeDate }}
                    {{ slot.start | localeTime }} - {{ slot.end | localeTime }}-
                    <span class="icon" v-if="typeIcon">
                      <component :is="typeIcon" class="icon-size" />
                    </span>
                    <span class="session-type" v-if="localeType">{{
                      localeType.toUpperCase()
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <p class="icon-and-text">
                    <span class="icon">
                      <span class="icon">
                        <AttendeeIcon class="icon-size" />
                      </span>
                    </span>
                    476 attending session
                  </p>
                </div>
              </div>
            </div>
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <h1 class="title">{{ localeTitle }}</h1>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <p class="icon-and-text">
                    <span class="icon">
                      <GlobeIcon class="icon-size" />
                    </span>
                    <span class="session-card-language">{{
                      event.hostLanguage.join('/').toUpperCase()
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div :class="{ 'hide-overflow': !readMore }">
              <div class="content" v-html="localeContent"></div>
            </div>
            <p class="button is-text" @click="readMore = !readMore">
              <span v-if="readMore">See Less</span>
              <span v-else>See More</span>
            </p>

            <component
              v-if="eventComponent"
              :is="eventComponent"
              :event="event"
              :event-slot="slot"
              :language="$i18n.locale"
            />
          </div>
          <div class="column is-one-third right-event-panel">
            <button class="button" @click="changeState">
              Stage: {{ slotState }}
            </button>
            <div>
              <SessionSidePanel
                :event="event"
                :event-slot="slot"
                :language="$i18n.locale"
                :slot-state="slotState"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppWrapper>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'

// import { slotState } from '../utils.js'
import SessionSidePanel from '@/components/SessionSidePanel.vue'
import GamesIcon from '@/icons/types/games.svg'
import KeynoteIcon from '@/icons/types/keynote.svg'
import PanelIcon from '@/icons/types/panel.svg'
import VirtualIcon from '@/icons/types/virtual.svg'
import Countdown from '../components/Countdown.vue'
import OneToMany from '../components/OneToMany.vue'
import ManyToMany from '../components/ManyToMany.vue'
import OfficialIcon from '@/icons/ifrc.svg'
import GlobeIcon from '@/icons/globe.svg'
import AttendeeIcon from '@/icons/attendee.svg'
import AppWrapper from '@/components/AppWrapper.vue'

const eventComponents = {
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
    AppWrapper
  },
  props: {
    eventId: { type: String, required: true }
  },
  data() {
    return {
      slotState: 'active',
      messages: [],
      chatMessage: '',
      readMore: false
    }
  },
  mounted() {
    // this.$clock.bind(this, () => {
    //   this.slotState = slotState(this.slot)
    // })
    //
    // if (!this.event) return this.$router.replace('/not-found')
    //
    // const sub = this.$socket.join(`event/${this.eventId}`)
    // this.$socket.on('')
    //
    /* this.language = this.authToken?.user_lang ?? this.language */
    //
    // this.$socket.emit('join-event', { eventId: this.eventId })
    // this.$socket.bindEvent(this, 'user-joined', data => {
    //   this.messages.push(data.name + ' joined')
    // })
    // this.$socket.bindEvent(this, 'user-left', data => {
    //   this.messages.push(data.name + ' left')
    // })
    // this.$socket.bindEvent(this, 'chat', data => {
    //   this.messages.push(data.name + ': ' + data.message)
    // })
  },
  destroyed() {
    // this.$socket.emit('leave-event', { eventId: this.eventId })
    this.$clock.unbind(this)

    // this.$socket.unbindEvent(this, 'user-joined')
    // this.$socket.unbindEvent(this, 'user-left')
    // this.$socket.unbindEvent(this, 'chat')
  },
  computed: {
    ...mapState('api', ['hasData', 'sessions', 'slots', 'speakers']),
    event() {
      return this.sessions.find(e => e.id === this.eventId)
    },
    slot() {
      return this.event && this.slots.find(s => s.id === this.event.slot)
    },
    eventType() {
      return this.$store.getters['api/type'](this.event.type)
    },
    typeIcon() {
      return this.eventType && typeIcons[this.eventType.icon]
    },
    localeType() {
      return this.eventType?.title[this.$i18n.locale]
    },
    localeTitle() {
      return this.event.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.event.hostOrganisation[this.$i18n.locale]
    },
    localeContent() {
      if (this.$i18n.locale === 'dev') return 'event.content'

      const content = this.event?.content?.[this.$i18n.locale]
      return content && marked(content)
    },
    sessionSpeakers() {
      return this.event.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    eventComponent() {
      if (!this.event || !this.slotState) return null
      if (this.slotState === 'before') return Countdown
      return eventComponents[this.event.type] ?? ManyToMany
    }
  },
  methods: {
    changeState() {
      const states = ['before', 'active', 'after']
      let i = Math.max(
        0,
        states.findIndex(s => s === this.slotState)
      )
      i = (i + 1) % states.length
      this.slotState = states[i]
    },
    chat() {
      if (!this.chatMessage) return
      // this.$socket.emit('chat', {
      //   eventId: this.eventId,
      //   message: this.chatMessage
      // })
      this.chatMessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-size {
  height: 1em;
  width: 1em;
}

.back-button {
  color: $grey;
  text-decoration: underline;
  font-weight: bold;
}

.section-headings {
  color: $section-headings-coloured;
  font-weight: bold;
}

.event-panels {
  border-block-start: 2px solid $grey-lighter;
}

.left-event-panel {
  border-inline-end: 2px solid $grey-lighter;
  overflow-x: hidden;
}
.right-event-panel {
  border-inline-end: 2px solid $grey-lighter;
}

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

.hide-overflow {
  max-height: 120px;
  overflow-y: hidden;
}

.see-more {
  text-align: center;
  p {
    display: inline-block;
  }
}
</style>
