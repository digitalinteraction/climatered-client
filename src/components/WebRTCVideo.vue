<template>
  <div class="webrtc-video">
    <video ref="webrtc-video" height="100" width="100" autoplay />
  </div>
</template>

<script>
export default {
  props: {
    mediaStream: { type: MediaStream, required: true }
  },
  mounted() {
    this.$refs['webrtc-video'].srcObject = this.mediaStream
  }
}
</script>
