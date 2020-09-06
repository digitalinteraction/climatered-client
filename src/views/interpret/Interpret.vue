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
            <div class="column is-three-fifths">
              <InterpretControls />
              <component
                v-if="helpContent"
                :is="helpContent"
                class="interpret-help content"
              />
            </div>
            <div class="column">
              <InterpretPanel />
            </div>
          </div>
        </div>
      </section>
    </div>
  </InterpretWrapper>
</template>

<script>
import { mapState } from 'vuex'
import { ROUTE_INTERPRET_HOME } from '@/const'
import { getTranslation } from '@/utils'

import InterpretWrapper from '@/components/interpret/InterpretWrapper.vue'

import InterpretControls from '@/components/interpret/InterpretControls.vue'
import InterpretPanel from '@/components/interpret/InterpretPanel.vue'

const content = {
  en: () =>
    import(/* webpackChunkName: "en" */ '@/content/interpret-help/en.mdx'),
  fr: () =>
    import(/* webpackChunkName: "fr" */ '@/content/interpret-help/fr.mdx'),
  es: () =>
    import(/* webpackChunkName: "es" */ '@/content/interpret-help/es.mdx'),
  ar: () =>
    import(/* webpackChunkName: "ar" */ '@/content/interpret-help/ar.mdx')
}

// import { ZoomMtg } from '@zoomus/websdk'

// ZoomMtg.preLoadWasm()
// ZoomMtg.prepareJssdk()

export default {
  components: {
    InterpretWrapper,
    InterpretControls,
    InterpretPanel
  },
  props: {
    sessionSlug: { type: String, required: true },
    channel: { type: String, required: true }
  },
  data() {
    return {
      interpretHomeRoute: { name: ROUTE_INTERPRET_HOME }
    }
  },
  computed: {
    ...mapState('interpret', ['isLive']),
    session() {
      return this.$store.getters['api/session'](this.sessionSlug)
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
    helpContent() {
      return content[this.$i18n.locale]
    }
  },
  mounted() {
    if (!this.session || !this.slot) {
      this.$router.push({ name: ROUTE_INTERPRET_HOME })
    }

    this.$store.dispatch('interpret/join', {
      sessionId: this.session.id,
      channel: this.channel
    })

    this.$socket.bindEvent(this, 'interpret-joined', user => {
      this.$store.commit('interpret/userJoined', user)
      this.$store.commit('interpret/message', { user, message: 'joined' })
    })
    this.$socket.bindEvent(this, 'interpret-started', user => {
      this.$store.dispatch('interpret/liveStarted', user)
      this.$store.commit('interpret/message', { user, message: 'started' })
    })
    this.$socket.bindEvent(this, 'interpret-message', (user, message) => {
      this.$store.commit('interpret/message', { user, message })
    })
    this.$socket.bindEvent(this, 'interpret-left', user => {
      this.$store.commit('interpret/userLeft', user)
      this.$store.commit('interpret/message', { user, message: 'left' })
    })
    this.$socket.bindEvent(this, 'interpret-stopped', () => {
      this.$store.commit('interpret/activeUser', null)
    })
    this.$socket.bindEvent(this, 'interpret-requested', (user, duration) => {
      this.$store.commit('interpret/startRequest', { user, duration })
    })
    this.$socket.bindEvent(this, 'interpret-accepted', async newUser => {
      this.$store.commit('interpret/updateRequest', {
        status: 'accept',
        newUser
      })
    })
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isLive) return next()

    let confirmed = window.confirm(this.$t('interpret.confirmLeave'))
    if (confirmed) next()
  },
  destroyed() {
    this.$store.dispatch('interpret/leave')
    this.$socket.unbindOwner(this)
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

.interpret-help {
  width: 100%;
  min-height: 200px;
  border: 2px dashed $blue;
  background-color: lighten($blue, 40%);
  border-radius: $radius-large;
  padding: 2em;
}
</style>
