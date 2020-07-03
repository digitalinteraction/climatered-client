<template>
  <div class="one-to-many">
    <div class="columns" v-if="videoLink">
      <div class="column is-two-thirds">
        <h2 class="title is-4">Live video</h2>

        <VideoEmbed :video-link="videoLink" />

        <div class="audio-channel" v-if="event.channels">
          <div class="columns">
            <div class="column is-narrow">
              <label class="label">Audio Channel</label>
              <ToggleSet
                :value="chosenChannel"
                @input="onChannel"
                :options="channels"
              />
            </div>
            <div class="column">
              <label class="label">Info</label>
              <audio ref="audio" type="audio/webm" controls />
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-thirds">
        <h2 class="title is-4">Questions and Answers</h2>
        <div v-if="slido" class="slido-wrapper embedded">
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
  </div>
</template>

<script>
import ToggleSet from '@/components/ToggleSet.vue'
import VideoEmbed from '@/components/VideoEmbed.vue'
import { findLink, parseSlidoLink } from '../utils.js'

export default {
  components: { ToggleSet, VideoEmbed },
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true },
    language: { type: String, required: true }
  },
  data() {
    return {
      chosenChannel: 'source',
      showPoll: false
    }
  },
  computed: {
    videoLink() {
      return findLink(this.event.links, 'video', this.language)
    },
    slido() {
      const link = findLink(this.event.links, 'poll', this.language)
      return link && parseSlidoLink(link)
    },
    channels() {
      return ['source'].concat(this.event.channels)
    },
    isSourceAudio() {
      return this.language === 'source'
    }
  },
  mounted() {
    this.joinChannel(this.chosenChannel)

    const audioCtx = new AudioContext()

    const track = audioCtx.createMediaElementSource(this.$refs.audio)
    track.connect(audioCtx.destination)

    // const numSeconds = 20
    // const sampleRate = audioCtx.sampleRate
    // const numChannels = 1
    // const length = numSeconds * sampleRate * numChannels

    // const buffer = audioCtx.createBuffer(numChannels, length, sampleRate)
    // buffer.loop = false

    // const source = audioCtx.createBufferSource()
    // source.buffer = buffer
    // source.connect(audioCtx.destination)
    // source.start()

    this.bufferStack = []
    this.audioCtx = audioCtx
    // let t = 0

    this.$socket.bindEvent(this, 'channel-data', async data => {
      console.log('channel-data')

      this.bufferStack.push(data)

      const blob = new Blob(this.bufferStack, { type: 'audio/webm' })
      const previousTime = this.$refs.audio.currentTime
      // t += this.$refs.audio.currentTime
      // console.log(t)

      this.$refs.audio.src = URL.createObjectURL(blob)
      this.$refs.audio.currentTime = previousTime

      if (this.bufferStack.length > 2 && this.$refs.audio.paused) {
        // start playing?
        this.$refs.audio.play()
      }
    })
  },
  destroyed() {
    this.leaveChannel(this.chosenChannel)
    this.$socket.unbindEvent(this, 'channel-data')
  },
  methods: {
    joinChannel(channel) {
      if (channel === 'source') {
        //
        // Unmute the iframe
        //
      } else {
        this.$socket.emit('join-channel', {
          eventId: this.event.id,
          channel: channel
        })
        // this.audioCtx.resume()
        // this.$refs.audio.play()
      }
    },
    leaveChannel(channel) {
      if (channel === 'source') {
        //
        // Mute the iframe
        //
      } else {
        this.$socket.emit('leave-channel', {
          eventId: this.event.id,
          channel: channel
        })
        // this.enqueueAudio()
      }
    },
    onChannel(newChannel) {
      // unsub from the current channel
      this.leaveChannel(this.chosenChannel)

      // Update the stored channel
      this.chosenChannel = newChannel

      // Join the new channel
      this.joinChannel(newChannel)
    },
    // setState(newState) {
    //   if (newState === 'playing') {
    //     this.$refs.audio.play()
    //   }
    //   if (newState === 'stopped') {
    //     this.$refs.audio.stop()
    //   }
    // },
    enqueueAudio() {
      // if (this.state !== 'playing') return
      // debugger
      console.log('enqueueAudio')

      if (this.bufferStack.length === 0) {
        // this.setState('stopped')
        console.log('no data')

        return
      }

      const [first, ...rest] = this.bufferStack
      this.bufferStack = rest

      console.log(first, rest.length)

      var audioURL = URL.createObjectURL(first)
      console.log({ audioURL })

      // const source = this.audioCtx.createBufferSource()
      // source.buffer = first
      // source.connect(this.audioCtx.destination)

      this.$refs.audio.src = audioURL
      // source.onended = () => this.enqueueAudio()
      // source.play()
    }
  }
}
</script>

<style lang="scss" scoped>
// .one-to-many {
// }

// .video-embed,
// .slido-wrapper {
//   background-color: #fafafa;
//   border-radius: $radius;
//   overflow: hidden;
//   position: relative;
// }

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

.audio-channel {
  audio {
    width: 100%;
  }
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
