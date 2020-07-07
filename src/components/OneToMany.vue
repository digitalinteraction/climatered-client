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
              <p>Reciever: {{ recieverState }}</p>
              <canvas width="400" height="100" ref="canvas"></canvas>
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
import { AudioReciever } from '../audio.js'

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
      showPoll: false,
      recieverState: null
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

    this.reciever = new AudioReciever(state => {
      this.recieverState = state
    })

    this.$socket.bindEvent(this, 'channel-data', async data => {
      this.reciever.push(data)

      this.reciever.doodle(this.$refs.canvas)
    })
  },
  destroyed() {
    this.leaveChannel(this.chosenChannel)
    this.$socket.unbindEvent(this, 'channel-data')
    this.reciever.stop()
    this.reciever = null
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

        // Start the reciever
        this.reciever.play()
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

        // Stop and reset the reciever
        this.reciever.stop()
      }
    },
    onChannel(newChannel) {
      if (this.chosenChannel === newChannel) return

      // unsub from the current channel
      this.leaveChannel(this.chosenChannel)

      // Update the stored channel
      this.chosenChannel = newChannel

      // Join the new channel
      this.joinChannel(newChannel)
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
