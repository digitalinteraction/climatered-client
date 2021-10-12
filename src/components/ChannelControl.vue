<template>
  <div class="channelControl">
    <div class="channelControl-message">
      <p>{{ $t('ifrc.channelControl.muteLabel') }}</p>
    </div>
    <Stack direction="horizontal" align="stretch" gap="regular">
      <!--
        Channel picker
      -->
      <div>
        <!-- Wrapped in a <div> to stop field's margin-bottom -->
        <SelectField
          name="chosenChannel"
          :value="currentChannel"
          @input="onChannelInput"
          :label="$t('ifrc.channelControl.channel')"
          :options="channelOptions"
        />
      </div>

      <!--
        Channel info and actions
      -->
      <Stack
        class="channelControl-info"
        v-if="showInfo"
        direction="vertical"
        align="center"
        gap="regular"
      >
        <p>
          <span class="channelControl-online" v-if="channelIsLive">
            {{ $t('ifrc.channelControl.isOnline') }},
            {{ audioMessage }}
          </span>
          <span class="channelControl-offline" v-else>
            {{ $t('ifrc.channelControl.isOffline') }}
          </span>
        </p>
        <div class="buttons is-centered">
          <button
            class="button is-success"
            @click="onStartStream"
            :disabled="!showStartButton"
          >
            <span class="icon">
              <fa :icon="['fas', 'play']" />
            </span>
            <span>
              {{ $t('ifrc.channelControl.start') }}
            </span>
          </button>
          <button
            class="button is-danger"
            @click="onStopStream"
            :disabled="!showStopButton"
          >
            <span class="icon">
              <fa :icon="['fas', 'stop']" />
            </span>
            <span>
              {{ $t('ifrc.channelControl.stop') }}
            </span>
          </button>
        </div>
      </Stack>
    </Stack>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  Stack,
  SelectField,
  SelectOption,
  RecieverState,
  AudioReciever,
} from '@openlab/deconf-ui-toolkit'
import languagesData from '@/data/languages.json'
import {
  AUDIO_HIGH_LEVEL,
  AUDIO_LOW_LEVEL,
  AUDIO_PLAYBACK_RATE,
  AUDIO_TRANSPORT_RATE,
} from '@/lib/module'

const CHANNEL_SOURCE = 'source'

interface Data {
  currentChannel: string
  channelIsLive: boolean
  bufferSize: number | null
  receiverState: RecieverState
  receiver: AudioReciever | null
}

export default Vue.extend({
  components: { Stack, SelectField },
  data(): Data {
    return {
      currentChannel: CHANNEL_SOURCE,
      channelIsLive: false,
      bufferSize: null,
      receiverState: RecieverState.inactive,
      receiver: null,
    }
  },
  props: {
    channels: { type: Array as PropType<string[]>, required: true },
    sessionId: { type: String, required: true },
  },
  computed: {
    channelOptions(): SelectOption[] {
      return [
        { value: CHANNEL_SOURCE, text: this.$t('ifrc.channelControl.source') },
      ].concat(
        this.channels.map((channel) => ({
          value: channel,
          text: languagesData[channel] ?? channel,
        }))
      )
    },
    showStartButton(): boolean {
      return Boolean(
        this.bufferSize &&
          this.channelIsLive &&
          this.bufferSize >= AUDIO_LOW_LEVEL &&
          this.receiverState !== RecieverState.playing
      )
    },
    showStopButton(): boolean {
      return Boolean(
        this.bufferSize &&
          this.bufferSize > 0 &&
          this.receiverState !== RecieverState.inactive
      )
    },
    showInfo(): boolean {
      return this.currentChannel !== CHANNEL_SOURCE
    },
    audioMessage(): unknown {
      if (this.receiverState === RecieverState.playing) {
        return this.$t('ifrc.channelControl.playing')
      }

      if (this.bufferSize && this.bufferSize > 0) {
        if (this.bufferSize < AUDIO_LOW_LEVEL) {
          const percent = ((this.bufferSize / AUDIO_LOW_LEVEL) * 100).toFixed(0)

          return this.$t('ifrc.channelControl.buffering', [`${percent}%`])
        } else {
          return this.$t('ifrc.channelControl.ready')
        }
      }

      return this.$t('ifrc.channelControl.stopped')
    },
  },
  created() {
    this.receiver = new AudioReciever({
      playbackRate: AUDIO_PLAYBACK_RATE,
      audioLowLevel: AUDIO_LOW_LEVEL,
      audioHighLevel: AUDIO_HIGH_LEVEL,
      onChange: (data) => {
        this.receiverState = data.state
        this.bufferSize = data.bufferSize
      },
      onDebug: (...args: unknown[]) => {
        console.debug(...args)
      },
    })

    this.$io.socket.on('channel-started', this.onChannelStarted)
    this.$io.socket.on('channel-data', this.onChannelData)
    this.$io.socket.on('channel-stopped', this.onChannelStopped)
  },
  destroyed() {
    this.$io.socket.off('channel-started', this.onChannelStarted)
    this.$io.socket.off('channel-data', this.onChannelData)
    this.$io.socket.off('channel-stopped', this.onChannelStopped)

    this.leaveChannel(this.currentChannel)
  },
  methods: {
    //
    // Form events
    //
    onChannelInput(newChannel: string) {
      if (newChannel === this.currentChannel) return

      this.leaveChannel(this.currentChannel)
      this.currentChannel = newChannel
      this.joinChannel(newChannel)
    },
    onStartStream() {
      console.debug('onStartStream')
      this.receiver?.playOrBuffer()
    },
    onStopStream() {
      console.debug('onStopStream')
      this.receiver?.stop()
    },

    //
    // Socket messages
    //
    onChannelStarted() {
      console.debug('onChannelStarted')
      this.channelIsLive = true
    },
    onChannelData(arrayBuffer: ArrayBuffer) {
      console.debug('onChannelData', arrayBuffer)
      this.receiver?.pushData({ arrayBuffer, sampleRate: AUDIO_TRANSPORT_RATE })
    },
    onChannelStopped() {
      console.debug('onChannelStopped')
      this.channelIsLive = false
    },

    //
    // Channels
    //
    joinChannel(channel: string) {
      if (channel === CHANNEL_SOURCE) {
        // unmute iframe ?
      } else if (this.receiver) {
        this.receiver.open()

        this.$store.dispatch('interpret/joinChannel', {
          sessionId: this.sessionId,
          channel,
        })
      } else {
        throw new Error('Cannot join channel, receiver not set')
      }
    },
    leaveChannel(channel: string) {
      if (channel === CHANNEL_SOURCE) {
        // mute iframe?
      } else if (this.receiver) {
        this.receiver.close()

        // Reset the liveness
        this.channelIsLive = false
        this.bufferSize = null

        this.$store.dispatch('interpret/leaveChannel', {
          sessionId: this.sessionId,
          channel,
        })
      } else {
        throw new Error('Cannot leave channel, receiver not set')
      }
    },
  },
})
</script>

<style lang="scss">
.channelControl {
  border-radius: $radius;
  background: $background;
  border: 1px solid $border;
  padding: 0.75em;
}
.channelControl-info {
  margin-top: 2rem;
  flex: 1;
  text-align: center;
}
.channelControl-message {
  margin-bottom: 1rem;
  font-weight: bold;
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
.channelControl-online {
  @include liveBeforeCircle(red);
}
.channelControl-offline {
  @include liveBeforeCircle($grey);
}
</style>
