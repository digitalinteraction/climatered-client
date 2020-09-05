<template>
  <div class="video-link">
    <a
      v-if="teamsLink"
      class="button is-medium"
      :href="teamsLink.url"
      target="_blank"
      >Open teams meeting →</a
    >
    <a
      v-if="zoomLink"
      class="button is-medium"
      :href="zoomLink.url"
      target="_blank"
      >Open zoom meeting →</a
    >
    <a
      v-if="youtubeLink"
      class="button is-medium"
      :href="youtubeLink.url"
      target="_blank"
      >Open Youtube Video →</a
    >
  </div>
</template>

<script>
//
// Embed a link to a video on another platform
// supports teams, zoom and youtube
//

import { parseYouTubeLink, parseTeamsLink, parseZoomLink } from '../utils'

export default {
  props: {
    link: { type: Object, required: true }
  },
  computed: {
    youtubeLink() {
      return parseYouTubeLink(this.link)
    },
    zoomLink() {
      return parseZoomLink(this.link)
    },
    teamsLink() {
      return parseTeamsLink(this.link)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-link {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px dashed $blue;
  background-color: lighten($blue, 40%);
  border-radius: $radius-large;

  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  background-color: $blue;
  color: $white;
}
</style>
