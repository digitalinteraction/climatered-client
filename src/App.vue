<template>
  <div id="app">
    <ApiError v-if="apiState === 'error'" :home-route="homeRoute">
      <BrandA slot="brand" />
      <PageFooter slot="footer" />
    </ApiError>
    <router-view v-else-if="apiState === 'ready'" />
    <AppLoading v-else />
    <DevControl :dev-plugin="$dev" :force-enable="isDev" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ApiError,
  AppLoading,
  DevControl,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { ConferenceConfig } from '@openlab/deconf-shared'
import { Location } from 'vue-router'

import PageFooter from './components/PageFooter.vue'
import { StorageKey } from './lib/module'
import BrandA from './branding/BrandA.vue'
import { setLocale } from './i18n/module'

interface Data {
  timerId: null | number
}

export default Vue.extend({
  components: { ApiError, AppLoading, DevControl, PageFooter, BrandA },
  data(): Data {
    return { timerId: null }
  },
  computed: {
    ...mapApiState('api', ['apiState', 'schedule', 'user']),
    settings(): ConferenceConfig | null {
      return this.schedule?.settings ?? null
    },
    homeRoute(): Location {
      return { name: Routes.Atrium }
    },
    isDev(): boolean {
      return process.env.NODE_ENV === 'development'
    },
  },
  async mounted(): Promise<void> {
    const token = localStorage.getItem(StorageKey.AuthToken)

    this.$temporal.setup()

    // Listen for site-visitors and update vuex
    this.$io.socket.on('site-visitors', (count: number) => {
      this.$store.commit('metrics/siteVisitors', count)
    })

    if (token) {
      await this.$store.dispatch('api/authenticate', token)
      if (this.user) {
        setLocale(this.user.user_lang)
      }
    } else {
      await this.$store.dispatch('api/fetchData')
      if (typeof this.$route.query.locale === 'string') {
        setLocale(this.$route.query.locale)
      }
    }

    this.timerId = setInterval(
      () => this.$store.dispatch('api/fetchData'),
      this.randomTick()
    )
  },
  destroyed(): void {
    this.$temporal.teardown()
    this.$io.teardown()

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  },
  methods: {
    randomTick(): number {
      return Math.round((3 + Math.random() * 4) * 60 * 1000)
    },
  },
})
</script>

<style lang="scss">
@import '~@openlab/deconf-ui-toolkit/dist/theme.scss';
@import '~@fortawesome/fontawesome-svg-core/styles.css';

// TODO: remove when upgrading deconf
.button .icon:first-child:not(:last-child) {
  margin-left: unset;
  margin-right: unset;
  margin-inline-start: calc(-0.75em - 1px);
  margin-inline-end: 0.375em;
}

// TODO: remove from DevControl
.devControl .devControl-block:first-child {
  display: none;
}

//
// Fonts
//
@font-face {
  font-display: swap;
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/noto/NotoSans-Regular.woff2') format('woff2');
}
@font-face {
  font-display: swap;
  font-family: 'Noto Sans';
  font-style: italic;
  font-weight: 400;
  src: url('/fonts/noto/NotoSans-Italic.woff2') format('woff2');
}
@font-face {
  font-display: swap;
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 700;
  src: url('/fonts/noto/NotoSans-Bold.woff2') format('woff2');
}
@font-face {
  font-display: swap;
  font-family: 'Noto Sans';
  font-style: italic;
  font-weight: 700;
  src: url('/fonts/noto/NotoSans-BoldItalic.woff2') format('woff2');
}

//
// Deconf hacks
//
.colorWidget {
  &.is-primary,
  &.is-secondary,
  &.is-twitter,
  &.is-login {
    background-color: $white;

    .colorWidget-title {
      color: $black;
    }

    .colorWidget-subtitle {
      font-weight: 400;
      color: $black;
    }
  }

  &.is-primary svg {
    color: $primary;
  }
  &.is-secondary svg {
    color: $secondary;
  }
  &.is-twitter svg {
    color: $twitter-blue;
  }
  &.is-twitter:hover {
    .colorWidget-title,
    .colorWidget-subtitle {
      color: $white;
    }
  }
  &.is-login svg {
    color: $link;
  }
  &.is-register {
    background: $primary;
    color: $white;
    .colorWidget-title {
      color: $white;
    }
  }
}
.content {
  a {
    font-weight: bold;
  }
}
</style>
