<template>
  <div class="webrtc-video">
    <video ref="webrtc-video" height="100" width="100" />
  </div>
</template>

<script>
export default {
  props: {
    mediaStream: { type: Object, required: true }
  },
  mounted() {
    this.$refs['webrtc-video'].srcObject = this.mediaStream
  }
}
</script>
