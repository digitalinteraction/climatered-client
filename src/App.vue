<template>
  <div id="app">
    <AppWrapper @locale="setLocale">
      <router-view />
    </AppWrapper>
  </div>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import jwt from 'jsonwebtoken'

export default {
  components: { AppWrapper },
  mounted() {
    const { token } = localStorage
    if (!token && this.$route.name !== 'Login') {
      this.$router.replace({ name: 'Login' })
    } else if (token) {
      this.$store.dispatch('api/fetchData')

      const userLang = jwt.decode(token).user_lang
      if (!userLang) console.error('jwt has no user_lang', jwt)
      this.setLocale(userLang)
    }
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
</style>
