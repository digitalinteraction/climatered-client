<template>
  <div id="webRTCVideoWrapper" :class="{ 'is-rounded': isLocalVideo }">
    <video ref="webrtc-video" autoplay />
    <span
      class="mute-button icon is-large has-text-white"
      v-if="muted && !isLocalVideo"
    >
      <fa :icon="`${muted ? 'microphone-slash' : 'microphone'}`" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    mediaStream: { type: MediaStream, required: true },
    muted: { type: Boolean, default: false },
    isLocalVideo: { type: Boolean, default: false }
  },
  mounted() {
    this.$refs['webrtc-video'].srcObject = this.mediaStream
    if (this.muted) {
      this.$refs['webrtc-video'].muted = true
      this.$refs['webrtc-video'].volume = 0
    }
  }
}
</script>
<style lang="scss" scoped>
#webRTCVideoWrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

video {
  object-fit: cover;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
}

.is-rounded {
  border-radius: 0.5rem;
  overflow: hidden;
}

.mute-button {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  border-radius: 2rem;
  background-color: $danger;
}
</style>
