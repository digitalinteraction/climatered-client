<template>
  <div class="session-sidepanel">
    <!-- Session Links -->
    <div class="sidepanel-section" v-if="hasNonVideoLinks">
      <h3 class="sidepanel-heading " v-t="'session.linksHeading'" />
      <div class="table-container">
        <table class="table is-bordered">
          <tr v-for="(link, i) in nonVideoLinks" :key="i">
            <td class="table-heading-column">{{ link.type }}</td>
            <td class="table-data">
              <a :href="link.url" target="_blank">{{
                link.title ? link.title : link.url
              }}</a>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Session Show Poll -->
    <div
      v-if="slido && sessionState == 'present'"
      :class="[
        'sidepanel-section',
        'slido-section',
        { 'poll-visible': showPoll }
      ]"
    >
      <h4 class="section-heading">
        Live Q&A
      </h4>
      <div id="slido-wrapper">
        <!-- Button -->
        <button
          v-if="!showPoll"
          class="button is-modern is-coral is-small is-fullwidth"
          @click="showPoll = true"
        >
          <span>{{ $t('session.joinLiveQandA') }}</span>
        </button>
        <!-- Slido embed -->
        <iframe
          v-else
          :src="slido.url"
          height="100%"
          width="100%"
          style="min-height: 560px;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { findLink, parseSlidoLink, getTranslation } from '@/utils'
import { mapState } from 'vuex'

export default {
  components: {},
  props: {
    session: { type: Object, required: true },
    sessionState: { type: String, required: true }
  },
  data() {
    return {
      showPoll: false
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'sessions', 'slots', 'speakers']),
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return getTranslation(this.session.hostOrganisation, [
        this.$i18n.locale,
        'en'
      ])
    },
    sessionSpeakers() {
      return this.session.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    slido() {
      const link = findLink(this.session.links, 'poll', this.$i18n.locale)
      console.log('link', link)
      return link && parseSlidoLink(link)
    },
    nonVideoLinks() {
      return this.session.links.filter(link => {
        return link.type !== 'video' && link.type !== 'poll'
      })
    },
    hasNonVideoLinks() {
      return !!this.nonVideoLinks.length > 0
    }
  },
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.session-sidepanel {
  .sidepanel-section {
    &.slido-section {
      overflow: hidden;
      #slido-wrapper {
        background-color: white;
        display: block;
      }
      &.poll-visible {
        // background-color: #252525;
        // padding-top: 30px;

        // .section-heading {
        //   display: none;
        // }
        #slido-wrapper {
          border: 1px solid $border;
          border-radius: 8px;
          height: 573px;
          overflow: hidden;
        }
      }
    }
  }
}

.sidepanel-heading {
  color: $cc-light-blue;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 0.5em;
}

.icon-size {
  height: 1em;
  width: 1em;
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
  overflow-x: scroll;
}
</style>
