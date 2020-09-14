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
        ref="iframe"
      ></iframe>
    </div>
    <div class="youtube-wrapper embedded" v-if="youtubeChannel">
      <iframe
        v-if="!disableLivestreams"
        width="100%"
        height="100%"
        :src="
          'https://www.youtube-nocookie.com/embed/live_stream?channel=' +
            youtubeChannel.channel
        "
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        ref="iframe"
      ></iframe>
      <div class="no-live" v-else>
        <p class="notification is-primary is-light" v-t="'videoEmbed.noLive'" />
      </div>
    </div>
  </div>
</template>

<script>
//
// Embed a video on the site, currently only supports youtube
//

import { parseYouTubeLink, parseYouTubeChannel } from '../utils.js'

export default {
  props: {
    videoLink: { type: Object, required: true },
    muted: { type: Boolean, default: false },
    disableLivestreams: { type: Boolean, default: false }
  },
  watch: {
    muted(newValue) {
      this.$refs.iframe.muted = newValue
    }
  },
  computed: {
    youtube() {
      return parseYouTubeLink(this.videoLink)
    },
    youtubeChannel() {
      return parseYouTubeChannel(this.videoLink)
    }
  }
}
</script>

<style lang="scss" scoped>
.youtube-wrapper {
  height: 0;
  padding-bottom: percentage(9 / 16);
  margin-bottom: 1rem;

  .no-live {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .notification {
    display: inline-block;
  }
}
</style>
