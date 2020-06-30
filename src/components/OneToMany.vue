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
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-thirds">
        <h2 class="title is-4">Questions and Answers</h2>
        <div v-if="slido" class="slido-wrapper embedded">
          <iframe
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
  computed: {
    videoLink() {
      return findLink(this.event.links, 'video', this.language)
    },
    slido() {
      const link = findLink(this.event.links, 'poll', this.language)
      return link && parseSlidoLink(link)
    },
    channels() {
      return [this.videoLink?.language].concat(this.event.channels)
    }
  },
  data() {
    return {
      chosenChannel: this.language
    }
  },
  mounted() {
    this.joinChannel(this.chosenChannel)

    this.$socket.bindEvent(this, 'channel-data', blob => {
      console.log('channel-data', blob)
    })
  },
  destroyed() {
    this.leaveChannel(this.chosenChannel)
    this.$socket.unbindEvent(this, 'channel-data')
  },
  methods: {
    joinChannel(channel) {
      if (channel === this.videoLink?.language) {
        // Unmute the iframe
      } else {
        this.$socket.emit('join-channel', {
          eventId: this.event.id,
          channel: channel
        })
      }
    },
    leaveChannel(channel) {
      if (channel === this.videoLink?.language) {
        // Mute the iframe
      } else {
        this.$socket.emit('leave-channel', {
          eventId: this.event.id,
          channel: channel
        })
      }
    },
    onChannel(newChannel) {
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
.one-to-many {
}

.video-embed,
.slido-wrapper {
  // background-color: #fafafa;
  // border-radius: $radius;
  // overflow: hidden;
  // position: relative;
}

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
}
</style>
