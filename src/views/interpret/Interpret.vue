<template>
  <InterpretWrapper>
    <div class="interpret" v-if="session && slot">
      <div class="interpret-navbar">
        <router-link
          :to="interpretHomeRoute"
          class="button is-text"
          active-class=""
        >
          {{ $t('general.backTo', [$t('interpretHome.title')]) }}
        </router-link>
        <span class="keyvalue">
          <span class="keyvalue-key" v-t="'interpret.sessionLabel'" />
          <span class="keyvalue-value">{{ localeSessionTitle }}</span>
        </span>
        <span class="keyvalue">
          <span class="keyvalue-key" v-t="'interpret.floorLabel'" />
          <span class="keyvalue-value">{{ floorLanguage.toUpperCase() }}</span>
        </span>
        <span class="keyvalue">
          <span class="keyvalue-key" v-t="'interpret.outputLabel'" />
          <span class="keyvalue-value">{{ channel.toUpperCase() }}</span>
        </span>
      </div>
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-two-thirds">
              <InterpretControls
                :session-id="session.id"
                :channel="channel"
                @start="onLiveStart"
                @end="onLiveEnd"
                @takeover="onTakeoverRequest"
              />
              <VideoLink v-if="videoLink" :link="videoLink" />
            </div>
            <div class="column">
              <p>Messaging</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </InterpretWrapper>
</template>

<script>
import { ROUTE_INTERPRET_HOME } from '../../const'
import { getTranslation, findLink } from '../../utils'

import InterpretWrapper from '@/components/InterpretWrapper.vue'
import VideoLink from '@/components/VideoLink.vue'
import InterpretControls from '@/components/InterpretControls.vue'

// import { ZoomMtg } from '@zoomus/websdk'

// ZoomMtg.preLoadWasm()
// ZoomMtg.prepareJssdk()

export default {
  components: { InterpretWrapper, VideoLink, InterpretControls },
  props: {
    sessionId: { type: String, required: true },
    channel: { type: String, required: true }
  },
  mounted() {
    if (!this.session || !this.slot) {
      this.$router.push({ name: ROUTE_INTERPRET_HOME })
    }
  },
  data() {
    return {
      interpretHomeRoute: { name: ROUTE_INTERPRET_HOME },
      isLive: false,
      recordTime: 0
    }
  },
  computed: {
    // ...mapState('api', ['slots', 'sessions']),
    session() {
      return this.$store.getters['api/session'](this.sessionId)
    },
    slot() {
      return this.session && this.$store.getters['api/slot'](this.session.slot)
    },
    floorLanguage() {
      return this.session.hostLanguage[0]
    },
    localeSessionTitle() {
      return getTranslation(this.session.title, [
        this.$i18n.locale,
        this.floorLanguage,
        'en'
      ])
    },
    videoLink() {
      return findLink(this.session.links, 'video', this.floorLanguage)
    }
  },
  methods: {
    onLiveStart() {
      this.isLive = true
    },
    onLiveEnd() {
      this.isLive = false
    },
    onTakeoverRequest(time) {
      console.log('please takeover in ' + time)
    }
  }
}
</script>

<style lang="scss" scoped>
.interpret-navbar {
  border: 1px solid $border;
  padding: 0.5em 0;
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:not(:last-child) {
    margin-inline-end: 54px;
  }
}

.keyvalue {
  font-size: $size-6;
  font-weight: bold;
  .keyvalue-key {
    color: $grey;
    text-transform: uppercase;
    margin-inline-end: 0.5em;
  }
  .keyvalue-value {
  }
}
</style>
