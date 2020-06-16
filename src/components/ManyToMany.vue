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
              <a :href="link" target="_blank">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findZoom, findTeams } from '../utils'
export default {
  props: {
    event: { type: Object, required: true },
    eventSlot: { type: Object, required: true }
  },
  computed: {
    zoomLink() {
      return findZoom(this.event.links)
    },
    teamsLink() {
      return findTeams(this.event.links)
    },
    nonVideoLinks() {
      return this.event.links.filter(
        l => l !== this.zoomLink?.url && l !== this.teamsLink?.url
      )
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
