<template>
  <div class="session-sidepanel">
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
        {{ $t('session.interact') }}
      </h4>
      <div class="embedded" id="slido-wrapper">
        <div v-if="!showPoll">
          <a class="button is-coral is-fullwidth" @click="showPoll = true">
            {{ $t('session.joinLiveQandA') }}
          </a>
        </div>
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
  name: 'SessionInteractionPanel',
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
  }
}
</script>

<style lang="scss" scoped>
.sidepanel-section {
  margin-bottom: 3em;
  &.slido-section {
    border-radius: 8px;
    overflow: hidden;
    #slido-wrapper {
      background-color: white;
    }
    &.poll-visible {
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
</style>
