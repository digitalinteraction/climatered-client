<template>
  <div class="many-to-many">
    <div class="columns">
      <div class="column is-one-half" v-if="zoomLink || teamsLink">
        <div class="video-link">
          <a
            v-if="teamsLink"
            class="button is-link is-large"
            :href="teamsLink.url"
            target="_blank"
            >Open teams meeting →</a
          >
          <a
            v-if="zoomLink"
            class="button is-link is-large"
            :href="zoomLink.url"
            target="_blank"
            >Open zoom meeting →</a
          >
        </div>
      </div>
      <div class="column">
        <h3 class="heading">Session info</h3>
        <div class="content">
          <p>The session organiser has provided these links for this session</p>
          <ul>
            <li v-for="(link, i) in nonVideoLinks" :key="i">
              <a :href="link.url" target="_blank">{{ link.url }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  findLink,
  parseYouTubeLink,
  parseTeamsLink,
  parseZoomLink
} from '../utils'

export default {
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true }
  },
  computed: {
    videoLink() {
      return findLink(this.event.links, 'video', this.language)
    },
    youtubeLink() {
      return this.videoLink && parseYouTubeLink(this.videoLink)
    },
    zoomLink() {
      return this.videoLink && parseZoomLink(this.videoLink)
    },
    teamsLink() {
      return this.videoLink && parseTeamsLink(this.videoLink)
    },
    nonVideoLinks() {
      return this.event.links.filter(l => l.type !== 'video')
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
</style>
