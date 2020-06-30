<template>
  <div class="translator" v-if="$store.state.api.hasData">
    <section class="section is-small">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <router-link class="button is-text" :to="{ name: 'Home' }">
                ← Back to schedule
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" v-if="videoLink">
      <div class="container">
        <div class="columns">
          <div class="column is-two-thirds">
            <h2 class="title is-3">Live video</h2>
            <VideoEmbed :video-link="videoLink" />
          </div>
          <div class="column">
            <h2 class="title is-3">Translator tools</h2>

            <label class="label">Pick your language</label>
            <ToggleSet
              v-model="chosenChannel"
              :options="channels"
              :disabled="isBroadcasting"
            />

            <div class="buttons" v-if="chosenChannel">
              <button v-if="!isBroadcasting" class="button" @click="start">
                Start broadcasting
              </button>
              <button v-else class="button is-primary" @click="stop">
                Stop broadcasting
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ToggleSet from '@/components/ToggleSet.vue'
import VideoEmbed from '@/components/VideoEmbed.vue'
import { findLink } from '../utils.js'

export default {
  components: { ToggleSet, VideoEmbed },
  props: {
    eventId: { type: String, required: true }
  },
  data() {
    return {
      chosenChannel: '',
      isBroadcasting: false,
      stream: null,
      timerId: null
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'events', 'slots']),
    event() {
      return this.events.find(e => e.id === this.eventId)
    },
    videoLink() {
      return findLink(this.event.links, 'video', this.language)
    },
    channels() {
      return this.event.channels
    }
  },
  mounted() {
    this.$socket.bindEvent(this, 'stop-channel-data', () => {
      this.stop()
    })
  },
  destroyed() {
    this.$socket.unbindEvent(this, 'stop-channel-data')
  },
  methods: {
    start() {
      this.isBroadcasting = true

      // Get an audio stream from the user
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

      // Pipe it up to the server

      // Register as the broadcaster
      this.$socket.emit('start-channel', {
        eventId: this.eventId,
        channel: this.chosenChannel
      })

      // DEBUG
      let i = 0
      this.timerId = setInterval(() => {
        this.$socket.emit('channel-data', 'plop ' + ++i)
      }, 1000)
    },
    stop() {
      this.isBroadcasting = false

      // Remove our stream (this.stream)
      clearInterval(this.timerId)
      this.timerId = null
    }
  }
}
</script>
