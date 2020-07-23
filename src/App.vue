<template>
  <div id="app">
    <router-view v-if="isReady" />
  </div>
</template>

<script>
import jwt from 'jsonwebtoken'
import { ROUTE_ATRIUM, ROUTE_TOKEN_CAPTURE } from './const'

export default {
  data() {
    return {
      isReady: false
    }
  },
  created() {
    const { token } = localStorage
    if (token) {
      this.$store.dispatch('api/fetchData')

      const user = jwt.decode(token)
      // this.setLocale(user.user_lang)
      this.$store.commit('api/user', user)
    } else if (
      this.$route.name !== ROUTE_ATRIUM &&
      this.$route.name !== ROUTE_TOKEN_CAPTURE
    ) {
      this.$router.replace({ name: ROUTE_ATRIUM })
    }

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
</style>
