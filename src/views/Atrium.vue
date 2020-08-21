<template>
  <AppWrapper>
    <div class="atrium">
      <div class="atrium-triangle">
        <div />
      </div>
      <div
        class="atrium-hero hero"
        style="background-image: url(/img/atrium-2.jpg)"
      >
        <div class="hero-body">
          <div class="xcontainer">
            <h1 class="title" v-t="'atrium.heroTitle'" />
            <p class="subtitle" v-t="'atrium.heroSubtitle'" />
          </div>
        </div>
      </div>
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
                v-for="sponsor in sponsors"
                :key="sponsor.name"
                :src="sponsor.url"
                :title="sponsor.name"
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
  en: '/img/atrium-2.jpg',
  fr: '/img/atrium-2.jpg',
  es: '/img/atrium-2.jpg',
  ar: '/img/atrium-2.jpg'
}

const sponsors = [
  { name: 'Solferino academy', url: '/sponsor/solferino-academy.svg' },
  { name: 'Climate Centre', url: '/sponsor/climate-centre.svg' },
  { name: 'Norwegian Red Cross', url: '/sponsor/norwegian-red-cross.svg' },
  { name: 'Finish Red Cross', url: '/sponsor/finish-red-cross.svg' },
  { name: 'Open Lab', url: '/sponsor/openlab.svg' }
]

export default {
  components: { AppWrapper },
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      sessionsRoute: { name: ROUTE_SESSIONS },
      sponsors
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
$tri-size: 120px;

.atrium {
  position: relative;
}

.atrium-hero {
  background-size: cover;
  background-position: bottom;
  border-bottom: 1px solid $border;

  .hero-body {
    text-shadow: 0 0 10px rgb(255, 255, 255);
  }
  .title {
    color: $black;
  }
  .subtitle {
    color: $black;
    font-weight: bold;
  }
  @include mobile {
    .hero-body {
      padding: 3rem 1.5rem 6rem;
    }
  }

  @include tablet {
    .title {
      font-size: $size-2;
    }
    .hero-body {
      padding: 3rem 1.5rem 12rem;
    }
  }
}
.atrium-triangle {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  position: absolute;
  top: 0;

  div {
    content: '';
    display: inline-block;
    border-block-start: solid $tri-size $cc-coral;
    border-inline-end: solid $tri-size $cc-coral;
    border-inline-start: solid $tri-size transparent;
    border-block-end: solid $tri-size transparent;

    @include touch {
      border-width: 42px;
    }
  }
}

.atrium-content {
  margin-bottom: $gap;
}

.atrium-login-or {
  margin: 0 1em;
  font-weight: 600;

  @include mobile {
    display: block;
    width: 100%;
    text-align: center;
    margin: 0.5em 1em 1em;
  }
}

.sponsors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  img {
    width: auto;
    height: 32px;
  }

  @include desktop {
    img:not(:last-child) {
      margin-inline-end: 3em;
      margin-block-end: 3em;
    }
  }

  @include touch {
    align-items: center;
    flex-direction: column;

    img {
      height: 48px;
      padding-block-end: 1em;
    }

    img:not(:last-child) {
      margin-inline-end: 0;
      margin-block-end: 0.75em;
    }
  }
}
</style>
