<template>
  <div class="one-to-many">
    <div class="bottom-panel">
      <VideoEmbed
        v-if="videoLink"
        :video-link="videoLink"
        :muted="!isSourceAudio"
      />
      <div class="notification is-warning is-light" v-else>
        {{ $t('oneToMany.noVideo') }}
      </div>

      <div class="audio-channel" v-if="session.enableTranslation">
        <div class="columns" v-if="canInterpret">
          <div class="column">
            <p
              class="notification is-info is-light"
              v-t="'oneToMany.muteLabel'"
              v-if="!isDev"
            />
            <pre v-else class="stats" v-html="stats || '{}'"></pre>
          </div>
          <div class="column is-two-fifths">
            <label for="language" class="label" v-t="'oneToMany.label'" />
            <div class="columns">
              <div class="column">
                <SelectField
                  name="language"
                  :value="chosenChannel"
                  @input="onChannel"
                  :options="channels"
                />
              </div>
              <div class="column is-narrow">
                <p>
                  <button
                    class="button is-success has-addons"
                    @click="startStream"
                    v-if="canStart"
                  >
                    <span class="icon">
                      <fa :icon="['fas', 'play']" />
                    </span>
                    <span v-t="'oneToMany.start'" />
                  </button>
                  <button
                    class="button is-danger"
                    @click="stopStream"
                    v-if="canStop"
                  >
                    <span class="icon">
                      <fa :icon="['fas', 'stop']" />
                    </span>
                    <span v-t="'oneToMany.stop'" />
                  </button>
                </p>
              </div>
            </div>
            <div class="audio-vis" v-if="chosenChannel !== 'source'">
              <p>
                <span
                  class="vis-online"
                  v-if="broadcastIsLive"
                  v-text="'Channel is live, '"
                />
                <span
                  class="vis-offline"
                  v-else
                  v-text="'Channel is offline, '"
                />
                <span v-text="audioMessage" />
              </p>
            </div>
          </div>
        </div>
        <div class="notification is-warning is-light is-inline-block" v-else>
          {{ $t('session.noInterpret') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
// The main bit for a broadcast-type session
//

import VideoEmbed from '@/components/VideoEmbed.vue'
import SelectField from '@/components/form/SelectField.vue'
import { findLink, parseSlidoLink } from '@/utils'
import { AudioReciever, RecieverState } from '@/audio'
import languages from '@/data/languages.json'
import { AUDIO_LOW_LEVEL } from '../const'

export default {
  components: { VideoEmbed, SelectField },
  props: {
    session: { type: Object, required: true },
    sessionSlot: { type: Object, required: true }
  },
  data() {
    return {
      chosenChannel: 'source',
      showPoll: false,
      bufferSize: 0,
      canInterpret: AudioReciever.isSupported(),
      stats: null,
      broadcastIsLive: false
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
      const base = [
        { value: 'source', labelKey: 'oneToMany.source' },
        { value: 'en', label: languages.en },
        { value: 'fr', label: languages.fr },
        { value: 'es', label: languages.es },
        { value: 'ar', label: languages.ar }
      ]
      return base.filter(item => item.value !== this.session.hostLanguage[0])
    },
    isSourceAudio() {
      return this.$i18n.locale === 'source'
    },
    isDev() {
      // return false
      return process.env.NODE_ENV === 'development'
    },
    audioMessage() {
      const t = (k, ...args) => this.$i18n.t(`oneToMany.${k}`, ...args)

      if (!this.stats) return t('stopped')

      const percent = n => `(${((n / AUDIO_LOW_LEVEL) * 100).toFixed(0)}%)`

      if (this.stats.state === RecieverState.playing) {
        return t('playing')
      }

      if (this.stats.bufferSize > 0) {
        if (this.stats.bufferSize < AUDIO_LOW_LEVEL) {
          return t('buffering', [percent(this.stats.bufferSize)])
        } else if (this.broadcastIsLive) {
          return t('ready')
        }
      }
      return t('stopped')
    },
    canStart() {
      return (
        Boolean(this.stats) &&
        this.broadcastIsLive &&
        this.stats.bufferSize >= AUDIO_LOW_LEVEL &&
        this.stats.state !== RecieverState.playing
      )
    },
    canStop() {
      return (
        Boolean(this.stats) &&
        this.stats.bufferSize > 0 &&
        this.stats.state !== RecieverState.inactive
      )
    }
  },
  mounted() {
    this.joinChannel(this.chosenChannel)

    this.reciever = new AudioReciever()

    this.reciever.$on('state', state => {
      this.stats.state = state
    })

    this.reciever.$on('stats', stats => {
      this.stats = stats
    })

    this.reciever.$on('buffer-size', bufferSize => {
      this.stats.bufferSize = bufferSize
    })

    this.$socket.bindEvent(this, 'channel-data', async data => {
      await this.reciever.push(data)
      this.broadcastIsLive = true
    })
    this.$socket.bindEvent(this, 'channel-started', () => {
      this.broadcastIsLive = true
    })
    this.$socket.bindEvent(this, 'channel-stopped', () => {
      this.broadcastIsLive = false
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

        // Emit a gtag event
        this.$gtag.event(`join-${this.session.id}-${channel}`, {
          event_category: 'interpret',
          event_label: 'Joined interpretation channel',
          value: 0
        })
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

        // Reset the liveness
        this.broadcastIsLive = false
        this.stats = null

        // Emit a gtag event
        this.$gtag.event(`leave-${this.session.id}-${channel}`, {
          event_category: 'interpret',
          event_label: 'Leave interpretation channel',
          value: 0
        })
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
    },
    startStream() {
      this.reciever.play()
    },
    stopStream() {
      this.reciever.stop()
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

@mixin liveBeforeCircle($color) {
  &:before {
    content: '';
    display: inline-block;
    width: 0.8em;
    height: 0.8em;
    border-radius: 999px;
    margin-inline-end: 0.2em;
    background-color: $color;
  }
}

.vis-online {
  @include liveBeforeCircle(red);
}
.vis-offline {
  @include liveBeforeCircle($grey);
}

.stats {
  padding: 5px;
  text-align: left;
}

.audio-vis {
  margin-top: -1rem;
}
</style>
