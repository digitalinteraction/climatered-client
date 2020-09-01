<template>
  <div class="webrtc-video">
    <video
      ref="webrtc-video"
      height="100"
      width="100"
      autoplay
      :muted="muted"
    />
  </div>
</template>

<script>
export default {
  props: {
    mediaStream: { type: MediaStream, required: false },
    muted: { type: Boolean, default: false }
  },
  mounted() {
    this.$refs['webrtc-video'].srcObject = this.mediaStream
  }
}
</script>
