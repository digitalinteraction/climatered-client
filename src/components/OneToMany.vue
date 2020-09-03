<template>
  <div class="one-to-many">
    <div v-if="videoLink">
      <div class="bottom-panel">
        <VideoEmbed :video-link="videoLink" :muted="!isSourceAudio" />

        <div class="audio-channel" v-if="session.enableTranslation">
          <div class="columns" v-if="canInterpret">
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
              <p>state={{ recieverState }} buffers={{ bufferSize }}</p>
              <canvas
                class="audio-vis"
                width="400"
                height="100"
                ref="canvas"
              ></canvas>
            </div>
          </div>
          <div class="notification is-warning is-light is-inline-block" v-else>
            {{ $t('session.noInterpret') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
// The main bit for a broadcast-type session
//

import ToggleSet from '@/components/ToggleSet.vue'
import VideoEmbed from '@/components/VideoEmbed.vue'
import { findLink, parseSlidoLink } from '@/utils'
import { AudioReciever } from '@/audio'

export default {
  components: { ToggleSet, VideoEmbed },
  props: {
    session: { type: Object, required: true },
    sessionSlot: { type: Object, required: true }
  },
  data() {
    return {
      chosenChannel: 'source',
      showPoll: false,
      recieverState: null,
      bufferSize: 0,
      canInterpret: AudioReciever.isSupported()
    }
  },
  computed: {
    videoLink() {
      return findLink(this.session.links, 'video', this.$i18n.locale)
    },
    slido() {
      const link = findLink(this.session.links, 'poll', this.$i18n.locale)
      return link && parseSlidoLink(link)
    },
    channels() {
      return ['source', 'en', 'fr', 'es', 'ar'].filter(
        l => l !== this.session.hostLanguage[0]
      )
    },
    isSourceAudio() {
      return this.$i18n.locale === 'source'
    }
  },
  mounted() {
    this.joinChannel(this.chosenChannel)

    this.reciever = new AudioReciever()

    this.reciever.$on('state', state => {
      this.recieverState = state
    })

    this.reciever.$on('buffer-size', bufferSize => {
      this.bufferSize = bufferSize
    })

    this.$socket.bindEvent(this, 'channel-data', async data => {
      await this.reciever.push(data)

      // this.reciever.doodle(this.$refs.canvas)
    })
  },
  destroyed() {
    this.leaveChannel(this.chosenChannel)
    this.$socket.unbindEvent(this, 'channel-data')
    this.reciever = null
  },
  methods: {
    joinChannel(channel) {
      if (channel === 'source') {
        //
        // Unmute the iframe
        //
      } else {
        // Start the reciever
        this.reciever.setup()

        this.$socket.emit('join-channel', this.session.id, channel)
      }
    },
    leaveChannel(channel) {
      if (channel === 'source') {
        //
        // Mute the iframe
        //
      } else {
        this.$socket.emit('leave-channel', this.session.id, channel)

        // Stop and reset the reciever
        this.reciever.teardown()
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

.audio-channel {
  audio {
    width: 100%;
  }
}

.audio-vis {
  border-radius: 4px;
  overflow: hidden;
}
</style>
