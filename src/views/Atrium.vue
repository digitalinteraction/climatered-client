<template>
  <AppWrapper>
    <div class="atrium">
      <div class="container">
        <!-- Hero -->
        <div
          class="atrium-hero box hero"
          style="background-image: url(/img/atrium.jpg)"
        >
          <div class="hero-body">
            <h1 class="title" v-t="'atrium.heroTitle'" />
            <p class="subtitle" v-t="'atrium.heroSubtitle'" />
          </div>
        </div>
        <div class="columns">
          <!-- Left column -->
          <div class="column is-two-thirds">
            <!-- Info -->
            <div class="box atrium-info">
              <div class="container is-smaller">
                <h1 class="title" v-t="'atrium.heading'" />

                <component
                  v-if="currentContent"
                  :is="currentContent"
                  class="content atrium-content"
                />

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
            </div>
          </div>
          <!-- Right column -->
          <div class="column is-one-third">
            <!-- Site visitors -->
            <div class="box atrium-widget is-coral">
              <h1 class="title">
                <fa :icon="['fas', 'user-friends']" class="fa-fw" />
                {{ parseInt(siteVisitors) | formatNumber }}
              </h1>
              <h3 class="subtitle">
                {{ $t('atrium.onlineNow') }}
              </h3>
            </div>

            <!-- Carbon saved -->
            <div
              class="box atrium-widget is-purple"
              v-if="carbon && carbon.carbonNotEmitted"
            >
              <h1 class="title">
                <fa :icon="['fas', 'leaf']" class="fa-fw" />
                {{ parseInt(carbon.carbonNotEmitted) | formatNumber }}
              </h1>
              <h3 class="subtitle">
                {{ $t('atrium.kilogramsOfCarbonSaved') }}
              </h3>
            </div>

            <!-- Social -->
            <a
              class="box atrium-widget is-twitter"
              href="https://twitter.com/search?q=%23climatered"
              target="_blank"
            >
              <h1 class="title has-text-white">
                <fa :icon="['fab', 'twitter']" class="fa-fw" />
                <span class="text">
                  {{ $t('atrium.social') }}
                </span>
              </h1>
              <h3 class="subtitle">
                {{ $t('atrium.tweetWith', ['#climatered']) }}
              </h3>
            </a>

            <!-- Featured sessions -->
            <div class="box atrium-widget" v-if="featuredSessions.length > 0">
              <h3 class="subtitle has-text-coral">
                {{ $t('atrium.featuredSesions') }}
              </h3>
              <div
                v-for="session in featuredSessions"
                :key="session.slug"
                class="session-tile-mini-wrapper"
              >
                <SessionTileMini
                  :session="session"
                  :current-time="currentTime"
                />
              </div>
              <router-link
                :to="sessionsRoute"
                class="button is-small is-purple is-fullwidth"
              >
                {{ $t('atrium.exploreAllSessions') }}
              </router-link>
            </div>
          </div>
        </div>
        <section>
          <!-- Project sponsors -->
          <div class="sponsors">
            <h3 class="sponsors-heading" v-t="'atrium.sponsorHeading'" />
            <div class="sponsors-grid">
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
import { mapGetters, mapState } from 'vuex'

import {
  ROUTE_LOGIN,
  ROUTE_SESSIONS,
  ROUTE_REGISTER,
  ROUTE_SCHEDULE
} from '../const'

import AppWrapper from '@/components/AppWrapper.vue'
import VideoEmbed from '@/components/VideoEmbed.vue'

import SessionTileMini from '@/components/SessionTileMini'

const content = {
  en: () => import(/* webpackChunkName: "en" */ '@/content/atrium/en.mdx'),
  fr: () => import(/* webpackChunkName: "fr" */ '@/content/atrium/fr.mdx'),
  es: () => import(/* webpackChunkName: "es" */ '@/content/atrium/es.mdx'),
  ar: () => import(/* webpackChunkName: "ar" */ '@/content/atrium/ar.mdx')
}

const activeContent = {
  en: () =>
    import(/* webpackChunkName: "en" */ '@/content/atrium-active/en.mdx'),
  fr: () =>
    import(/* webpackChunkName: "fr" */ '@/content/atrium-active/fr.mdx'),
  es: () =>
    import(/* webpackChunkName: "es" */ '@/content/atrium-active/es.mdx'),
  ar: () =>
    import(/* webpackChunkName: "ar" */ '@/content/atrium-active/ar.mdx')
}

const banner = {
  en: '/img/atrium-2.jpg',
  fr: '/img/atrium-2.jpg',
  es: '/img/atrium-2.jpg',
  ar: '/img/atrium-2.jpg'
}

const atriumVideo = {
  language: '*',
  type: 'video',
  url: 'https://www.youtube.com/watch?v=sA69GnNYwx8'
}

const sponsors = [
  { name: 'Solferino academy', url: '/sponsor/solferino-academy.svg' },
  { name: 'Climate Centre', url: '/sponsor/climate-centre.svg' },
  { name: 'Open Lab', url: '/sponsor/openlab.svg' },
  { name: 'Al Jazeera', url: '/sponsor/al-jazeera.svg' },
  { name: 'Italian Red Cross', url: '/sponsor/croce-rossa-v2.svg' },
  { name: 'Norwegian Red Cross', url: '/sponsor/norwegian-red-cross.svg' },
  { name: 'British Red Cross', url: '/sponsor/british-red-cross.svg' },
  { name: 'Finish Red Cross', url: '/sponsor/finish-red-cross.svg' }
]

export default {
  components: { AppWrapper, SessionTileMini, VideoEmbed },
  mounted() {
    this.getCarbonData()

    this.$clock.bind(this, () => {
      this.currentTime = this.$route.query.time
        ? parseInt(this.$route.query.time)
        : Date.now()
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  filters: {
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  data() {
    return {
      currentTime: Date.now(),
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      sponsors,
      atriumVideo
    }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'siteVisitors', 'carbon']),
    ...mapGetters('api', ['featuredSessions']),
    currentContent() {
      const chosenContent = this.user ? activeContent : content
      return chosenContent[this.$i18n.locale]
    },
    currentBanner() {
      return banner[this.$i18n.locale]
    },
    sessionsRoute() {
      return {
        name: this.settings?.scheduleLive ? ROUTE_SCHEDULE : ROUTE_SESSIONS
      }
    }
  },
  methods: {
    getCarbonData() {
      this.$store.dispatch('api/fetchCarbonData')
    }
  }
}
</script>

<style lang="scss" scoped>
$block-spacing: 1.5rem;
.atrium {
  background-color: #f2f2f2;
  padding: $block-spacing;
  position: relative;
  @include mobile {
    padding: 0;
  }
}

// Hero
.atrium-hero {
  background-size: cover;
  background-position: bottom;
  border-bottom: 1px solid $border;
  border-radius: $radius;
  margin-bottom: $block-spacing;
  padding: 2.5rem;

  @include mobile {
    border-radius: 0;
    margin-bottom: 0;
  }

  .hero-body {
    padding: 0 0 10rem 0;
    .title {
      color: $black;
      font-weight: bold;
      @include tablet {
        font-size: $size-2;
      }
    }
    .subtitle {
      color: $black;
      font-weight: bold;
    }
  }
}

// Info
.atrium-info {
  background-color: white;
  border-radius: $radius;
  padding: 2.5rem;

  @include mobile {
    border-radius: 0;
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

// Sponsors
.sponsors {
  margin-top: 7rem;
}

.sponsors-heading {
  text-align: center;
  margin-bottom: 3em;
  text-transform: uppercase;
}

.sponsors-grid {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;

  img {
    width: auto;
    height: 36px;
  }

  @include tablet {
    img {
      margin-inline-start: 2em;
      margin-inline-end: 2em;
      margin-block-end: 3em;
    }
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
  }

  @include mobile {
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

.box.atrium-widget {
  @include mobile {
    margin-left: $block-spacing;
    margin-right: $block-spacing;
  }
  &.is-twitter {
    background-color: $cc-twitter;
    &:hover {
      background-color: darken($color: $cc-twitter, $amount: 3);
      box-shadow: none;
    }
    h1.title,
    h3.subtitle {
      color: white;
    }
  }
  &.is-purple {
    background-color: $cc-purple;
    h1.title,
    h3.subtitle {
      color: white;
    }
  }
  &.is-coral {
    background-color: $cc-coral;
    h1.title,
    h3.subtitle {
      color: white;
    }
  }

  h1.title {
    font-size: 1.8em;
    font-weight: bold;
    &.has-text-coral {
      color: $cc-coral;
    }
  }
  h3.subtitle {
    font-size: 1em;
    font-weight: bold;
    &.has-text-coral {
      color: $cc-coral;
    }
  }
}

.session-tile-mini-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid $border;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }
}
</style>
