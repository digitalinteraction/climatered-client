<template>
  <AppWrapper>
    <div class="atrium">
      <img class="atrium-hero" src="/img/atrium.svg" />
      <div class="atrium-info">
        <section class="section">
          <div class="columns">
            <div class="column is-two-thirds">
              <div class="container">
                <div
                  v-if="currentContent"
                  class="atrium-content content"
                  v-html="currentContent"
                />
              </div>

              <!-- Show login/register if they are not signed in -->
              <div class="buttons is-centered" v-if="!user">
                <router-link
                  class="button is-link is-medium"
                  :to="registerRoute"
                  v-t="'atrium.registerButton'"
                />
                <div class="atrium-login-or" v-t="'atrium.or'" />
                <router-link
                  class="button is-medium"
                  :to="loginRoute"
                  v-t="'atrium.loginButton'"
                />
              </div>

              <!-- Show a link to the atrium if they are signed in -->
              <div class="buttons is-centered" v-if="user">
                <router-link
                  class="button is-link is-medium"
                  :to="scheduleRoute"
                  v-t="'atrium.scheduleButton'"
                />
              </div>
            </div>
            <div class="column">
              <a
                class="twitter-timeline"
                href="https://twitter.com/dog_rates?ref_src=twsrc%5Etfw"
                data-height="600"
                data-dnt="true"
                >{{ $t('atrium.tweetTitle') }}</a
              >
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import { ROUTE_LOGIN, ROUTE_SCHEDULE, ROUTE_REGISTER } from '../const'
import { mapState } from 'vuex'

import AppWrapper from '@/components/AppWrapper.vue'

import contentEN from '@/content/atrium/en.md'
import contentFR from '@/content/atrium/fr.md'
import contentES from '@/content/atrium/es.md'
import contentAR from '@/content/atrium/ar.md'

const content = {
  en: contentEN,
  fr: contentFR,
  es: contentES,
  ar: contentAR,
  dev: 'atrium.content'
}

export default {
  components: { AppWrapper },
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      scheduleRoute: { name: ROUTE_SCHEDULE }
    }
  },
  computed: {
    ...mapState('api', ['user']),
    currentContent() {
      return content[this.$i18n.locale]
    }
  },
  async mounted() {
    // setTimeout(() => {
    //   import(
    //     /* webpackIgnore: true */ 'https://platform.twitter.com/widgets.js'
    //   )
    // }, 200)
  }
}
</script>

<style lang="scss" scoped>
.atrium {
}

.atrium-hero {
  width: 100%;
  height: auto;
  border-bottom: 1px solid $border;
}

.atrium-content {
  margin-bottom: $gap;
}

.atrium-login-or {
  margin: 0 1em;
  font-weight: 600;
}
</style>
