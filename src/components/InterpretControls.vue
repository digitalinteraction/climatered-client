<template>
  <div class="interpret-controls">
    <div class="columns">
      <div class="column">
        <details>
          <summary>
            <span
              class="controls-label is-toggle"
              v-t="'interpret.testLabel'"
            />
          </summary>
          <p>
            Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed
            diam eget risus varius blandit sit amet non magna. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Maecenas faucibus
            mollis interdum. Donec sed odio dui.
          </p>
        </details>
      </div>
      <div class="column">
        <Stack direction="vertical" gap="medium" align="center">
          <button
            class="button"
            :class="startClasses"
            @click="start"
            :disabled="isLive"
          >
            {{ $t('interpret.startAction') }}
          </button>
          <p>
            <span v-if="isLive">
              <span class="live-indicator" />
              {{ $t('interpret.live') }}
            </span>
            <template v-if="!isLive">00:00:00</template>
            <template v-else>{{ timeSinceLive | friendlyTime }}</template>
          </p>
          <button
            class="button"
            :class="stopClasses"
            @click="stop"
            :disabled="!isLive"
            v-t="'interpret.stopAction'"
          />
        </Stack>
      </div>
      <div class="column">
        <Stack direction="vertical" gap="regular" align="start">
          <div>
            <p class="controls-label">
              {{ $t('interpret.takeoverActionLabel') }}
            </p>
            <div class="buttons">
              <button class="button is-small" @click="plusOne">
                {{ $tc('interpret.plusMins', 1) }}
              </button>
              <button class="button is-small" @click="plusThree">
                {{ $tc('interpret.plusMins', 3) }}
              </button>
              <button class="button is-small" @click="plusFive">
                {{ $tc('interpret.plusMins', 5) }}
              </button>
            </div>
          </div>
          <div>
            <p class="controls-label">
              {{ $t('interpret.takeoverStatusLabel') }}
            </p>
            <p>
              <span class="tag is-light is-info">
                {{ $t('interpret.noResponse') }}
              </span>
            </p>
          </div>
        </Stack>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { AudioBroadcaster, BroadcastState } from '../audio.js'
import Stack from '@/components/Stack.vue'

export default {
  components: { Stack },
  props: {
    sessionId: { type: String, required: true },
    channel: { type: String, required: true }
  },
  data() {
    return {
      timeSinceLive: 0,
      broadcastState: null
    }
  },
  computed: {
    ...mapState('interpret', ['isLive', 'liveStarted']),
    startClasses() {
      return this.isLive ? 'is-primary' : 'is-primary is-outlined'
    },
    stopClasses() {
      return this.isLive ? 'is-black' : 'is-light'
    }
  },
  filters: {
    /** adapted from https://stackoverflow.com/questions/3733227 */
    friendlyTime(timeInMs) {
      const duration = Math.floor(timeInMs / 1000)

      const h = Math.floor(duration / 3600)
      const m = Math.floor((duration % 3600) / 60)
      const s = Math.floor(duration % 60)

      return [h, m, s].map(n => n.toFixed(0).padStart(2, '0')).join(':')
    }
  },
  created() {
    this.broadcaster = new AudioBroadcaster(
      newState => {
        this.broadcastState = newState
      },
      arrayBuffer => {
        this.$store.dispatch('interpret/sendData', arrayBuffer)
      }
    )
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.timeSinceLive = this.isLive
        ? Date.now() - this.liveStarted.getTime()
        : 0
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    async start() {
      try {
        const isAllowed = await this.$store.dispatch('interpret/goLive', {
          sessionId: this.sessionId,
          channel: this.channel
        })

        if (isAllowed === false) {
          return alert('You cannot broadcast right now')
        }

        await this.broadcaster.start()
      } catch (error) {
        this.broadcaster.handleStreamError(error)
      }
    },
    async stop() {
      if (this.broadcastState === BroadcastState.active) {
        await this.broadcaster.stop()
      }
      this.$store.dispatch('interpret/disconnect')
    },
    plusOne() {
      this.$store.dispatch('interpret/requestTakeover', '1m')
    },
    plusThree() {
      this.$store.dispatch('interpret/requestTakeover', '3m')
    },
    plusFive() {
      this.$store.dispatch('interpret/requestTakeover', '5m')
    }
  }
}
</script>

<style lang="scss" scoped>
.interpret-controls {
  padding: 1em;
  border: 2px dashed $border;
  border-radius: $radius-large;
  background: $white-bis;
  margin-bottom: 1em;
  min-height: 200px;
}

.controls-label {
  color: $navy;
  text-transform: uppercase;
  font-weight: bold;

  &.is-toggle {
    cursor: pointer;
  }
}

// .button.is-primary.is-live[disabled] {
//   background-color: $primary;
//   opacity: 1;
// }

.live-indicator {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 999px;
  background: #eb0000;
  margin-inline-end: 0.2em;
}
</style>
