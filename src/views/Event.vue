<template>
  <div class="event-page">
    <section class="section">
      <div class="container">
        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <!-- <div class="level-item">
              <div class="control">
                <div class="select">
                  <select v-model="language">
                    <option>en</option>
                    <option>es</option>
                    <option>fr</option>
                    <option>ar</option>
                  </select>
                </div>
              </div>
            </div>-->
            <div class="level-item">
              <button class="button" @click="changeState">
                Stage: {{ slotState }}
              </button>
            </div>
          </div>
        </div>

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
            <div class="content">
              <p>A simple Read More, Read Less pen in Vue.js</p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Venenatis lectus magna fringilla urna. Etiam tempor orci eu
                lobortis. Integer quis auctor elit sed vulputate mi sit. Lacinia
                at quis risus sed vulputate odio ut enim blandit. Nibh praesent
                tristique magna sit amet purus. Eleifend donec pretium vulputate
                sapien nec sagittis. Facilisi morbi tempus iaculis urna id
                volutpat. Ultrices neque ornare aenean euismod.<span
                  v-if="readMore"
                ></span>
                <span v-else>...</span>
              </p>

              <p v-show="readMore">
                Ligula ullamcorper malesuada proin libero nunc consequat
                interdum varius. Turpis egestas pretium aenean pharetra magna ac
                placerat. Sed egestas egestas fringilla phasellus faucibus
                scelerisque eleifend donec. Sed cras ornare arcu dui. Aliquam
                vestibulum morbi blandit cursus. Adipiscing elit ut aliquam
                purus sit amet. Aenean sed adipiscing diam donec adipiscing
                tristique risus nec. Ut etiam sit amet nisl purus in mollis. Eu
                mi bibendum neque egestas congue quisque egestas diam in.
                Pellentesque adipiscing commodo elit at imperdiet dui accumsan
                sit.
              </p>
              <div class="see-more">
                <p class="button is-text" @click="readMore = !readMore">
                  <span v-if="readMore">See Less</span>
                  <span v-else>See More</span>
                </p>
              </div>
            </div>
          </div>
          <div class="column is-one-third right-event-panel">
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
                  <span class="session-card-language">{{
                    event.hostLanguage.join('/').toUpperCase()
                  }}</span>
                </p>
                <p class="icon-and-text">
                  <span class="icon">
                    <span class="icon">
                      <PlatformIcon class="icon-size" />
                    </span>
                  </span>
                  {{ event.attendeeInteraction }}
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
                  No Info Here
                </p>

                <p></p>
              </div>
            </div>
          </div>
        </div>

        <component
          v-if="eventComponent"
          :is="eventComponent"
          :event="event"
          :event-slot="slot"
          :language="$i18n.locale"
        />
      </div>
    </section>
  </div>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'

// import { slotState } from '../utils.js'
import SpeakerRow from '@/components/SpeakerRow.vue'
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
import DevicesIcon from '@/icons/devices.svg'
import InteractionIcon from '@/icons/interaction.svg'
import RecordIcon from '@/icons/rec.svg'
import HelpIcon from '@/icons/help-desk.svg'
import PlatformIcon from '@/icons/platform.svg'

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
    SpeakerRow,
    HelpIcon,
    PlatformIcon,
    DevicesIcon,
    InteractionIcon,
    RecordIcon
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
    eventComponent() {
      if (!this.event || !this.slotState) return null
      if (this.slotState === 'before') return Countdown
      return eventComponents[this.event.type] ?? ManyToMany
    }
    // authToken() {
    //   return jwt.decode(localStorage.token)
    // }
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
  height: 0.9em;
  width: 0.9em;
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
  border-top: 2px solid $light-grey;
}

.left-event-panel {
  border-right: 2px solid $light-grey;
  overflow-x: hidden;
}
.right-event-panel {
  border-right: 2px solid $light-grey;
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

.see-more {
  text-align: center;
  p {
    display: inline-block;
  }
}
</style>
