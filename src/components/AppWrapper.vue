<template>
  <div class="app-wrapper">
    <div class="app-header">
      <div class="app-header-start">
        <!--
            Navigation bar
        -->
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <router-link :to="atriumRoute" class="navbar-item">
              <img src="/img/brand.svg" alt="Home" width="160" height="28" />
            </router-link>
            <a
              role="button"
              class="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              @click.prevent="toggleMenu"
              ref="menuButton"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <!--
            Mobile dropdown menu
          -->
          <div class="navbar-menu" ref="navbarMenu">
            <div class="navbar-start">
              <!-- Atrium link -->
              <router-link
                class="navbar-item"
                :to="atriumRoute"
                active-class="is-active"
              >
                <AtriumIcon class="navbar-item-icon" />
                <span class="navbar-item-text" v-t="'atrium.navTitle'" />
              </router-link>
              <!-- Schedule link -->
              <router-link
                class="navbar-item"
                :to="scheduleRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <ScheduleIcon class="navbar-item-icon" />
                <span class="navbar-item-text" v-t="'schedule.navTitle'" />
              </router-link>
              <!-- Coffee link -->
              <router-link
                class="navbar-item"
                :to="coffeeRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <CoffeeChatIcon class="navbar-item-icon" />
                <span class="navbar-item-text" v-t="'coffeechat.navTitle'" />
              </router-link>
              <!-- Help link -->
              <router-link
                class="navbar-item"
                :to="helpRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <HelpDeskIcon class="navbar-item-icon" />
                <span class="navbar-item-text" v-t="'help.navTitle'" />
              </router-link>
            </div>
            <div class="navbar-end">
              <div class="navbar-item">
                <div class="select is-rounded">
                  <select :value="$i18n.locale" @change="onLocale">
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                    <option value="es">ES</option>
                    <option value="ar">AR</option>
                    <option v-if="isDev" value="dev">_DEV</option>
                  </select>
                </div>
              </div>
              <router-link class="navbar-item" v-if="user" :to="profileRoute">
                {{ user.sub }}
              </router-link>
              <router-link class="navbar-item" v-if="!user" :to="loginRoute">
                {{ $t('general.loginButton') }}
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="app-tabbar">
      <!-- Atrium tab -->
      <router-link class="tabbar-item" :to="atriumRoute">
        <AtriumIcon class="tabbar-item-icon" />
        <span class="tabbar-item-text" v-t="'atrium.navTitle'" />
      </router-link>
      <!-- Schedule tab -->
      <router-link class="tabbar-item" :to="scheduleRoute" :disabled="!user">
        <ScheduleIcon class="tabbar-item-icon" />
        <span class="tabbar-item-text" v-t="'schedule.navTitle'" />
      </router-link>
      <!-- Coffee chat tab -->
      <router-link class="tabbar-item" :to="coffeeRoute" :disabled="!user">
        <CoffeeChatIcon class="tabbar-item-icon" />
        <span class="tabbar-item-text" v-t="'coffeechat.navTitle'" />
      </router-link>
      <!-- Help tab -->
      <router-link class="tabbar-item" :to="helpRoute" :disabled="!user">
        <HelpDeskIcon class="tabbar-item-icon" />
        <span class="tabbar-item-text" v-t="'help.navTitle'" />
      </router-link>
    </div>
    <div class="app-page">
      <slot />
    </div>
  </div>
</template>

<script>
import {
  ROUTE_ATRIUM,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_LOGIN,
  ROUTE_PROFILE
} from '../const'

import { mapState } from 'vuex'

import CoffeeChatIcon from '@/icon/coffee-chat.svg'
import HelpDeskIcon from '@/icon/help-desk.svg'
import AtriumIcon from '@/icon/atrium.svg'
import ScheduleIcon from '@/icon/schedule.svg'

export default {
  components: { CoffeeChatIcon, HelpDeskIcon, AtriumIcon, ScheduleIcon },
  data() {
    return {
      showingMenu: false,
      loginRoute: { name: ROUTE_LOGIN },
      atriumRoute: { name: ROUTE_ATRIUM },
      scheduleRoute: { name: ROUTE_SCHEDULE },
      coffeeRoute: { name: ROUTE_COFFEE_CHAT },
      helpRoute: { name: ROUTE_HELP },
      profileRoute: { name: ROUTE_PROFILE }
    }
  },
  computed: {
    ...mapState('api', ['user']),
    isDev() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
      this.$refs.menuButton.classList.toggle('is-active', this.showingMenu)
      this.$refs.navbarMenu.classList.toggle('is-active', this.showingMenu)
    },
    onLocale(event) {
      const newLocale = event.target.value

      this.$i18n.locale = newLocale
      const newDir = newLocale === 'ar' ? 'rtl' : 'lrt'

      const html = document.documentElement
      html.setAttribute('lang', newLocale)
      html.setAttribute('dir', newDir)
    },
    clickGuard(event) {
      console.log(event)
      if (!this.user) {
        event.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$tabbar-width: 5.5rem;

.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.app-header {
  border-bottom: 1px solid $border;
}

@mixin link {
  &[disabled] {
    color: $grey-light;
    pointer-events: none;
  }

  @include desktop {
    &:hover:not([disabled]),
    &.router-link-active {
      background-color: $white-ter;
      color: $black;
    }
  }
}

.tabbar-item {
  font-size: $size-7;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: $greyish;

  margin: 6px;
  padding: 6px 0;
  border-radius: $radius-large;

  @include link;

  .tabbar-item-text {
  }
  .tabbar-item-icon {
    height: 3rem;
    width: 3rem;
  }

  &:not(:last-child) {
    margin-bottom: 6px;
  }

  &.router-link-active {
    color: $link;
  }
}

.navbar-item {
  display: flex;
  align-items: center;
  color: $greyish;

  @include link;

  .navbar-item-icon {
    width: 3rem;
    height: 3rem;
    margin-right: 0.5rem;
  }

  &[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }
}

@include desktop {
  .app-tabbar {
    position: absolute;
    top: $navbar-height;
    bottom: 0;
    width: $tabbar-width;

    inset-inline-start: 0;
    border-inline-end: 1px solid $border;

    display: flex;
    flex-direction: column;
  }
  .app-page {
    margin-inline-start: $tabbar-width;
  }
  .navbar-start {
    display: none;
  }
}

@include touch {
  .app-tabbar {
    display: none;
  }
}
.app-tabbar {
  // ...
}

.app-page {
  // ...
}
</style>
