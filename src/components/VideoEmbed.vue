<template>
  <div class="video-embed">
    <div class="youtube-wrapper embedded" v-if="youtube">
      <iframe
        width="100%"
        height="100%"
        :src="'https://www.youtube-nocookie.com/embed/' + youtube.id"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
import { parseYouTubeLink } from '../utils.js'

export default {
  props: {
    videoLink: { type: Object, required: true }
  },
  computed: {
    youtube() {
      return parseYouTubeLink(this.videoLink)
    }
  }
}
</script>

<style lang="scss" scoped>
.youtube-wrapper {
  height: 0;
  padding-bottom: percentage(9 / 16);
  margin-bottom: 1rem;
}
</style>
