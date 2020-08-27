<template>
  <div class="many-to-many">
    <div class="video-panel">
      <div v-if="zoomLink || teamsLink">
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
    eventSlot: { type: Object, required: true },
    language: { type: String, required: true }
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
    nonVideoLinks1() {
      return this.event.links.filter(l => l.type !== 'video')
    }
  }
}
</script>

<style lang="scss" scoped>
.video-link {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.video-panel {
  padding-top: 3em;
}

.left-event-panel {
  border-right: 2px solid $grey-lighter;
}
.right-event-panel {
  border-right: 2px solid $grey-lighter;
}
.table-container {
  display: inline-block;
  overflow: auto;
}
.table-heading-column {
  background: $grey-lighter;
}
td {
  font-weight: bold;
  color: $cc-black;
}

.link-container {
  width: 100%;
  overflow-x: hidden;
}
</style>
