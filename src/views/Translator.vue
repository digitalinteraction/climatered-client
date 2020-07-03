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
      isBroadcasting: false,
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
  created() {
    this.stream = null
    this.mediaRecorder = null
  },
  mounted() {
    this.$socket.bindEvent(this, 'stop-channel-data', () => {
      this.stop()
    })
  },
  destroyed() {
    this.$socket.unbindEvent(this, 'stop-channel-data')
    this.stop()
  },
  methods: {
    async start() {
      try {
        this.isBroadcasting = true

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 128000 // 128 Kbit/sec
        })

        mediaRecorder.ondataavailable = async event => {
          const arrayBuffer = await event.data.arrayBuffer()
          this.$socket.emitBinary('channel-data', arrayBuffer)
        }

        mediaRecorder.start(1000)

        // **Not** stored in data to avoid reactivity
        this.stream = stream
        this.mediaRecorder = mediaRecorder

        // Register as the broadcaster
        this.$socket.emit('start-channel', {
          eventId: this.eventId,
          channel: this.chosenChannel
        })
      } catch (error) {
        switch (error.name) {
          case 'NotFoundError':
            alert('Unable to open your call because no microphone were found.')
            break
          case 'SecurityError':
          case 'PermissionDeniedError':
            // Do nothing; this is the same as the user canceling the call.
            break
          default:
            alert('Error opening your or microphone: ' + error.message)
            break
        }

        this.isBroadcasting = false
      }
    },
    async stop() {
      this.isBroadcasting = false

      this.mediaRecorder?.stop()

      this.stream?.getTracks().forEach(t => t.stop())
    }
  }
}
</script>
