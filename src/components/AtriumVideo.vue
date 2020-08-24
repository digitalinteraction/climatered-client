<template>
  <VideoEmbed class="atrium-video" :video-link="atriumVideo" />
</template>

<script>
import VideoEmbed from '@/components/VideoEmbed.vue'

export default {
  components: { VideoEmbed },
  data() {
    return {
      atriumVideo: {
        language: '*',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=sA69GnNYwx8'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include desktop {
  .atrium-video {
    width: 66%;
  }
}
</style>
