<template>
  <div class="one-to-many">
    <div class="columns" v-if="youtube">
      <div class="column is-two-thirds">
        <h2 class="title is-4">Live video</h2>
        <div class="youtube-wrapper">
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
      <div class="column is-one-thirds">
        <h2 class="title is-4">Questions and Answers</h2>
        <div v-if="slido" class="slido-wrapper">
          <iframe
            :src="'https://app.sli.do/event/' + slido.id"
            height="100%"
            width="100%"
            style="min-height: 560px;"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findYoutube, findSlido } from '../utils.js'

export default {
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true }
  },
  computed: {
    youtube() {
      return findYoutube(this.event.links)
    },
    slido() {
      return findSlido(this.event.links)
    }
  }
}
</script>

<style lang="scss" scoped>
.one-to-many {
}
.youtube-wrapper,
.slido-wrapper {
  background-color: #fafafa;
  border-radius: $radius;
  overflow: hidden;
  position: relative;

  > iframe {
    position: absolute;
    left: 0;
    top: 0;
  }
}

.youtube-wrapper {
  height: 0;
  padding-bottom: percentage(9 / 16);
  // background-color: #fafafa;
  // position: relative;
  // border-radius: $radius;
  // overflow: hidden;
}
.slido-wrapper {
  height: 0;
  padding-bottom: percentage(1.5 / 1);
}
</style>
