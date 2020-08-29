<template>
  <div class="translator">
    <section class="section is-small">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <router-link class="button is-text" to="/prototype">
                ← Back to schedule
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-two-thirds" v-if="videoLink">
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
import { findLink } from '@/utils'
import { AudioBroadcaster, BroadcastState } from '@/audio'

// var types = [
//   'video/webm',
//   'audio/webm',
//   'video/webm;codecs=vp8',
//   'video/webm;codecs=daala',
//   'video/webm;codecs=h264',
//   'audio/webm;codecs=opus',
//   'video/mpeg'
// ]

// for (var i in types) {
//   console.log(
//     types[i] + ': ' + (MediaRecorder.isTypeSupported(types[i]) ? 'Maybe' : 'No')
//   )
// }

export default {
  components: { ToggleSet, VideoEmbed },
  props: {
    eventId: { type: String, required: true }
  },
  data() {
    return {
      chosenChannel: '',
      broadcastState: null,
      timerId: null
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'sessions', 'slots']),
    event() {
      return this.sessions.find(e => e.id === this.eventId)
    },
    videoLink() {
      return findLink(this.event.links, 'video', this.language)
    },
    channels() {
      return (
        this.event.enableTranslation &&
        ['en', 'fr', 'es', 'ar'].filter(l => l !== this.event.hostLanguage)
      )
    },
    isBroadcasting() {
      return this.broadcastState === BroadcastState.active
    }
  },
  created() {
    this.broadcaster = new AudioBroadcaster(
      newState => {
        this.broadcastState = newState
      },
      arrayBuffer => {
        this.$socket.emitBinary('send-to-channel', arrayBuffer)
      }
    )
  },
  mounted() {
    this.$socket.bindEvent(this, 'channel-takeover', () => {
      this.stop()
    })
  },
  destroyed() {
    this.$socket.unbindEvent(this, 'channel-takeover')
    this.stop()
  },
  methods: {
    async start() {
      try {
        // Register as the broadcaster
        this.$socket.emit('start-channel', this.eventId, this.chosenChannel)

        // Start broadcasting
        await this.broadcaster.start()

        // Let the ui know
        // this.isBroadcasting = true
      } catch (error) {
        this.broadcaster.handleStreamError(error)
      }
    },
    async stop() {
      if (this.isBroadcasting) {
        await this.broadcaster.stop()
      }

      // this.isBroadcasting = false
    }
  }
}
</script>
