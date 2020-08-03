<template>
  <div id="app">
    <router-view v-if="isReady" />
  </div>
</template>

<script>
import {
  ROUTE_ATRIUM,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_LOGIN,
  ROUTE_REGISTER
} from './const'

// Routes that can be visited without being logged in
const noAuthRoutes = [
  ROUTE_ATRIUM,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_LOGIN,
  ROUTE_REGISTER
]

export default {
  data() {
    return {
      isReady: false
    }
  },
  mounted() {
    const { token } = localStorage
    if (token) {
      //
      // If there is a token stored, authenticate with it
      //
      this.$store.dispatch('api/authenticate', {
        socket: this.$socket,
        token
      })
    } else if (!noAuthRoutes.includes(this.$route.name)) {
      //
      // If there isn't a token and it isn't a whitelisted route, go to the atrium
      //
      this.$router.replace({ name: ROUTE_ATRIUM })
    }

    //
    // If they came to exactly the root, go to the atrium
    //
    if (this.$route.path === '/') {
      this.$router.replace({ name: ROUTE_ATRIUM })
    }

    this.isReady = true
  },
  methods: {
    setLocale(newLocale) {
      this.$i18n.locale = newLocale
      const newDir = newLocale === 'ar' ? 'rtl' : 'lrt'

      const html = document.documentElement
      html.setAttribute('lang', newLocale)
      html.setAttribute('dir', newDir)
    }
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
