<template>
  <AppWrapper>
    <div class="atrium">
      <img v-if="currentBanner" :src="currentBanner" class="atrium-hero" />
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
                  v-t="'general.registerButton'"
                />
                <div class="atrium-login-or" v-t="'atrium.or'" />
                <router-link
                  class="button is-medium"
                  :to="loginRoute"
                  v-t="'general.loginButton'"
                />
              </div>

              <!-- Show a link to the atrium if they are signed in -->
              <div class="buttons is-centered" v-if="user">
                <router-link
                  class="button is-link is-medium"
                  :to="sessionsRoute"
                  v-t="'atrium.sessionsButton'"
                />
              </div>
            </div>
            <div class="column">
              <!-- <a
                class="twitter-timeline"
                href="https://twitter.com/dog_rates?ref_src=twsrc%5Etfw"
                data-height="600"
                data-dnt="true"
                >{{ $t('atrium.tweetTitle') }}</a
              > -->
            </div>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <div class="sponsors">
              <img
                src="/sponsor/solferino-academy.svg"
                alt="Solferino academy"
              />
              <img src="/sponsor/climate-centre.svg" alt="Climate Centre" />
              <img
                src="/sponsor/norwegian-red-cross.svg"
                alt="Norwegian Red Cross"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import { ROUTE_LOGIN, ROUTE_SESSIONS, ROUTE_REGISTER } from '../const'
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

const banner = {
  en: '/img/atrium-en.svg',
  fr: '/img/atrium-fr.svg',
  es: '/img/atrium-es.svg',
  ar: '/img/atrium-ar.svg'
}

export default {
  components: { AppWrapper },
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      sessionsRoute: { name: ROUTE_SESSIONS }
    }
  },
  computed: {
    ...mapState('api', ['user']),
    currentContent() {
      return content[this.$i18n.locale]
    },
    currentBanner() {
      return banner[this.$i18n.locale]
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

.sponsors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  img {
    width: auto;
    height: 42px;

    &:not(:last-child) {
      margin-inline-end: 4em;
    }
  }

  @include touch {
    align-items: flex-start;
    flex-direction: column;

    img {
      // flex: 1;
      padding-block-end: 1em;
    }

    img:not(:last-child) {
      margin-inline-end: 0;
      margin-block-end: 0.5em;
    }
  }
}
</style>
