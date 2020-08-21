<template>
  <div class="many-to-many">
    <div class="columns">
      <div class="column is-two-thirds left-event-panel">
        <div class="columns">
          <div class="column is-one-half" v-if="zoomLink || teamsLink">
            <h3 class="section-headings">Session</h3>
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
          <div class="column is-one-half">
            <h3 class="section-headings">Links</h3>
            <div class="table-container">
              <table class="table is-bordered">
                <tr v-for="(link, i) in nonVideoLinks" :key="i">
                  <td class="table-heading-column">{{ link.type }}</td>
                  <td class="table-data">
                    <a :href="link.url" target="_blank">{{ link.url }}</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
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

  display: flex;
  justify-content: center;
  align-items: center;
}

.left-event-panel {
  border-right: 2px solid $light-grey;
}
.table-container {
  display: inline-block;
  overflow: auto;
}
.table-heading-column {
  background: $light-grey;
}
td {
  font-weight: bold;
  color: black;
}
</style>
