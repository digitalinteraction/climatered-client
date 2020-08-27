<template>
  <AppWrapper>
    <div class="atrium">
      <div class="atrium-triangle">
        <div />
      </div>
      <div
        class="atrium-hero hero"
        style="background-image: url(/img/atrium.jpg)"
      >
        <div class="hero-body">
          <div class="container is-smaller">
            <h1 class="title" v-t="'atrium.heroTitle'" />
            <p class="subtitle" v-t="'atrium.heroSubtitle'" />
          </div>
        </div>
      </div>
      <div class="atrium-info">
        <section class="section">
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
import { ROUTE_LOGIN, ROUTE_SESSIONS, ROUTE_REGISTER } from '../const'
import { mapState } from 'vuex'

import AppWrapper from '@/components/AppWrapper.vue'
import VideoEmbed from '@/components/VideoEmbed.vue'

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
  { name: 'Italian Red Cross', url: '/sponsor/croce-rossa.svg' },
  { name: 'Norwegian Red Cross', url: '/sponsor/norwegian-red-cross.svg' },
  { name: 'British Red Cross', url: '/sponsor/british-red-cross.svg' },
  { name: 'Finish Red Cross', url: '/sponsor/finish-red-cross.svg' }
]

export default {
  components: { AppWrapper, VideoEmbed },
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      sessionsRoute: { name: ROUTE_SESSIONS },
      sponsors,
      atriumVideo
    }
  },
  computed: {
    ...mapState('api', ['user']),
    currentContent() {
      const chosenContent = this.user ? activeContent : content
      return chosenContent[this.$i18n.locale]
    },
    currentBanner() {
      return banner[this.$i18n.locale]
    }
  }
}
</script>

<style lang="scss" scoped>
$tri-size: 120px;

.atrium {
  position: relative;
}

@include tablet {
  .container.is-smaller {
    max-width: 720px;
  }
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
  pointer-events: none;

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
    img:not(:last-child) {
      margin-inline-end: 4.5em;
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
</style>
