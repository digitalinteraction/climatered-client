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
  ROUTE_ERROR
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
  ROUTE_ERROR
]

export default {
  components: { ApiError, CookiePopup },
  data() {
    return {
      isReady: false
    }
  },
  computed: {
    ...mapState('api', ['apiState'])
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

    this.isReady = true
  }
}
</script>

<style lang="scss">
// @import '~bulma/sass/base/_all.sass';
// @import '~bulma/sass/elements/_all.sass';
// @import '~bulma/sass/form/_all.sass';
// @import '~bulma/sass/helpers/_all.sass';
// @import '~bulma/sass/layout/_all.sass';
@import '~bulma/bulma.sass';
@import '@/scss/app.scss';

@include tablet {
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

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
