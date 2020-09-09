<template>
  <div id="app">
    <ApiError v-if="apiState === 'error'" />
    <router-view v-else-if="isReady" />
    <CookiePopup />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import {
  ROUTE_ATRIUM,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_TERMS,
  ROUTE_PRIVACY,
  ROUTE_ERROR,
  ROUTE_FAQS,
  ROUTE_GUIDELINES
} from './const'

import ApiError from '@/components/ApiError.vue'
import CookiePopup from '@/components/CookiePopup.vue'

// Routes that can be visited without being logged in
const noAuthRoutes = [
  ROUTE_ATRIUM,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_TERMS,
  ROUTE_PRIVACY,
  ROUTE_FAQS,
  ROUTE_GUIDELINES,
  ROUTE_ERROR
]

export default {
  components: { ApiError, CookiePopup },
  data() {
    return {
      isReady: false,
      timerId: null
    }
  },
  computed: {
    ...mapState('api', ['apiState'])
  },
  async created() {
    this.$socket.bindEvent(this, 'site-visitors', count => {
      this.$store.commit('api/siteVisitors', count)
    })
  },
  async mounted() {
    const { token } = localStorage

    if (token) {
      //
      // If there is a token stored, authenticate with it & fetch data
      //
      await this.$store.dispatch('api/authenticate', {
        socket: this.$socket,
        token
      })
    } else {
      // If there isn't a token, still fetch data (should we await this?)
      await this.$store.dispatch('api/fetchData')

      //
      // If there isn't a token and it isn't a whitelisted route, go to the atrium
      //
      if (!noAuthRoutes.includes(this.$route.name)) {
        this.$router.replace({ name: ROUTE_ATRIUM })
      }
    }

    const scheduleTick = Math.round((3 + Math.random() * 4) * 60 * 1000)
    this.timerId = setInterval(
      () => this.$store.dispatch('api/fetchSessions'),
      scheduleTick
    )

    this.isReady = true
  },
  destroyed() {
    this.$socket.unbindOwner(this)
    if (this.timerId) clearInterval(this.timerId)
  }
}
</script>

<style lang="scss">
@import '~bulma/bulma.sass';
@import '@/scss/app.scss';

.embedded {
  background-color: #fafafa;
  border-radius: $radius;
  overflow: hidden;
  position: relative;

  > iframe {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.button {
  font-weight: 600;
}

.label:not(:last-child) {
  margin-bottom: 0.1em;
}
</style>
