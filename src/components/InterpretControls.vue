<template>
  <div class="interpretControls" :class="controlsClasses">
    <Stack direction="horizontal" align="start" gap="regular">
      <!--
        Microphone selection
      -->
      <Stack direction="vertical" gap="medium" align="start">
        <SelectField
          v-if="userDevices.length > 0"
          name="device"
          v-model="chosenDevice"
          :label="$t('ifrc.interpretControls.deviceLabel')"
          :options="userDevices"
          :disabled="currentUserIsLive"
        />
        <div class="buttons is-centered">
          <button
            class="button is-text"
            @click="forceFetchDevices"
            :disabled="currentUserIsLive"
          >
            {{ $t('ifrc.interpretControls.refreshButton') }}
          </button>
        </div>
      </Stack>

      <!--
        Not live buttons
      -->
      <Stack direction="vertical" gap="medium" align="center" v-if="canGoLive">
        <button
          class="button"
          :class="startClasses"
          @click="onStart"
          :disabled="currentUserIsLive"
        >
          {{ $t('ifrc.interpretControls.start') }}
        </button>
        <p v-if="currentUserIsLive">
          <span>
            <span class="interpretControls-liveIndicator" />
            {{ $t('ifrc.interpretControls.liveLabel') }}
          </span>
          {{ timeSinceLive }}
        </p>
        <button
          class="button"
          :class="stopClasses"
          @click="onStop"
          :disabled="!currentUserIsLive"
        >
          {{ $t('ifrc.interpretControls.stop') }}
        </button>
      </Stack>

      <!--
        Live buttons
      -->
      <Stack direction="vertical" gap="medium" align="center" v-else>
        <p>
          {{
            $t('ifrc.interpretControls.liveMessage', [
              activeBooth.interpreter.name,
            ])
          }}
        </p>
        <button class="button" :class="startClasses" @click="onTakeover">
          {{ $t('ifrc.interpretControls.takeoverAction') }}
        </button>
      </Stack>
    </Stack>
  </div>
</template>

<script lang="ts">
import { AUDIO_TRANSPORT_RATE } from '@/lib/module'
import { mapInterpretState } from '@/store/interpret-module'
import {
  InterpretBooth,
  Interpreter,
} from '@openlab/deconf-shared/dist/interpret'
import {
  Stack,
  SelectField,
  BroadcasterState,
  // AudioBroadcaster,
  getCountdown,
  SelectOption,
} from '@openlab/deconf-ui-toolkit'
import Vue, { PropType } from 'vue'
import { AudioBroadcaster } from '@/hack/broadcaster'

interface Data {
  userDevices: SelectOption[]
  broadcastState: BroadcasterState
  chosenDevice: string | undefined
  broadcaster: AudioBroadcaster
}

export default Vue.extend({
  components: { Stack, SelectField },
  props: {
    booth: { type: Object as PropType<InterpretBooth>, required: true },
  },
  data(): Data {
    return {
      userDevices: [],
      broadcastState: BroadcasterState.inactive,
      chosenDevice: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      broadcaster: null as any,
    }
  },
  computed: {
    ...mapInterpretState('interpret', ['self', 'activeBooth']),
    currentUserIsLive(): boolean {
      return Boolean(this.activeBooth && this.activeBooth.isSelf)
    },
    controlsClasses(): unknown {
      return { 'is-live': this.currentUserIsLive }
    },
    startClasses(): unknown {
      return {
        'is-primary': true,
        'is-outlined': !this.currentUserIsLive,
      }
    },
    stopClasses(): unknown {
      return this.currentUserIsLive ? 'is-black' : 'is-light'
    },
    canGoLive(): unknown {
      return this.activeBooth === null || this.currentUserIsLive
    },
    scheduleDate(): Date {
      return this.$temporal.date
    },
    timeSinceLive(): string {
      if (!this.activeBooth) return '0s'

      if (this.scheduleDate.getTime() <= this.activeBooth.startTime.getTime()) {
        return '00:00:00'
      }

      const { hours, minutes, seconds } = getCountdown(
        this.activeBooth.startTime,
        this.scheduleDate
      )
      const pad = (v: number) => v.toString().padStart(2, '0')
      return [pad(hours), pad(minutes), pad(seconds)].join(':')
    },
  },
  created() {
    this.broadcaster = new AudioBroadcaster({
      audioTransportRate: AUDIO_TRANSPORT_RATE,
      onChange: (change) => {
        this.broadcastState = change.state
      },
      onData: (data) => {
        this.$store.dispatch('interpret/sendAudio', data)
      },
      onDebug: (...args) => {
        console.debug(...args)
      },
      audioWorklet: {
        name: 'socket-record-processor',
        path: '/socket-record-processor.js',
      },
    })

    this.$io.socket.on('interpreter-started', this.onInterpreterStarted)
  },
  destroyed() {
    this.$io.socket.off('interpreter-started', this.onInterpreterStarted)

    if (this.currentUserIsLive) {
      this.onStop()
    }
  },
  methods: {
    onInterpreterStarted(user: Interpreter) {
      if (!this.self) return

      if (
        this.broadcastState === BroadcasterState.active &&
        user.id !== this.self.id
      ) {
        this.stopBroadcast()
      }
    },
    async onStart() {
      try {
        const result = await this.broadcaster.start(this.chosenDevice)
        this.chosenDevice = result.chosenDevice
        this.$store.dispatch('interpret/startInterpret', this.booth)
      } catch (error) {
        this.broadcaster.handleStreamError(error)
        this.$store.dispatch('interpret/stopInterpret', this.booth)
      }
    },
    async onStop() {
      this.stopBroadcast()
      this.$store.dispatch('interpret/stopInterpret', this.booth)
    },
    async onTakeover() {
      let msg = this.$t('ifrc.interpretControls.takeoverConfirm') as string
      if (!window.confirm(msg)) return

      await this.onStart()
    },

    stopBroadcast() {
      this.broadcaster.stop()
    },
    async forceFetchDevices() {
      //
      // Request a stream and quickly close it so we have permission
      //
      const s = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })

      setTimeout(() => {
        s.getTracks().forEach((t) => t.stop())
      }, 500)

      return this.fetchDevices()
    },
    async fetchDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const audioDevices = devices.filter(
        (d) =>
          d.kind === 'audioinput' &&
          d.label !== '' &&
          !d.label.match(/bluetooth/i)
      )

      if (audioDevices.length > 0 && !this.chosenDevice) {
        this.chosenDevice = (
          audioDevices.find((d) => d.deviceId === 'default') ?? audioDevices[0]
        ).deviceId
      }

      this.userDevices = audioDevices.map((d) => ({
        value: d.deviceId,
        text: d.label,
      }))
    },
  },
})
</script>

<style lang="scss">
.interpretControls {
  .stack > .stack {
    flex: 1;
  }
}
.interpretControls-liveIndicator {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 999px;
  background: red;
  margin-inline-end: 0.2em;
}
</style>
