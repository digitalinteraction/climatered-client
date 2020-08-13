<template>
  <div class="event-page">
    <section class="section">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <router-link class="button is-text" to="/prototype">
                Back to schedule
              </router-link>
            </div>
          </div>
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
            </div> -->
            <div class="level-item">
              <button class="button" @click="changeState">
                Stage: {{ slotState }}
              </button>
            </div>
          </div>
        </div>
        <div class="buttons"></div>
        <h1 class="title">{{ event.name }}</h1>

        <table class="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Start</th>
              <th>End</th>
              <th>Session Id</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ slot.start | localeDate }}</td>
              <td>{{ slot.start | localeTime }}</td>
              <td>{{ slot.end | localeTime }}</td>
              <td>{{ event.id }}</td>
            </tr>
          </tbody>
        </table>

        <h2 class="heading">About</h2>
        <div class="content" v-if="localeContent" v-html="localeContent"></div>

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
import Countdown from '../components/Countdown.vue'
import OneToMany from '../components/OneToMany.vue'
import ManyToMany from '../components/ManyToMany.vue'

const eventComponents = {
  plenary: OneToMany,
  panel: OneToMany
}

export default {
  props: {
    eventId: { type: String, required: true }
  },
  data() {
    return {
      slotState: 'active',
      messages: [],
      chatMessage: ''
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
    ...mapState('api', ['hasData', 'sessions', 'slots']),
    event() {
      return this.sessions.find(e => e.id === this.eventId)
    },
    slot() {
      return this.event && this.slots.find(s => s.id === this.event.slot)
    },
    localeContent() {
      if (this.$i18n.locale === 'dev') return 'event.content'

      const content = this.event?.content?.[this.$i18n.locale]
      return content && marked(content)
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

<style lang="scss" scoped></style>
