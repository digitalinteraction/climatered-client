<template>
  <div class="app-wrapper">
    <div class="app-header">
      <div class="app-header-start">
        <!--
            Navigation bar
        -->
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <router-link :to="atriumRoute" class="navbar-item" active-class="">
              <img
                src="/img/brand-new.svg"
                alt="Home"
                width="160"
                height="28"
              />
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
              <router-link
                v-for="item in nav"
                :key="item.name"
                :to="item.to"
                :disabled="isDisabled(item.name)"
                class="navbar-item"
              >
                <component :is="item.icon" class="navbar-item-icon" />
                <span class="navbar-item-text">
                  {{ $t(item.titleKey) }}
                  <template v-if="isDisabled(item.name)">
                    {{ '– ' + $t('general.comingSoon') }}
                  </template>
                </span>
              </router-link>
            </div>
            <div class="navbar-end">
              <div class="navbar-item">
                <LanguageControl />
              </div>
              <!-- Profile link -->
              <router-link class="navbar-item" v-if="user" :to="profileRoute">
                {{ user.sub }}
              </router-link>
              <!-- or Login button -->
              <router-link class="navbar-item" v-if="!user" :to="loginRoute">
                {{ $t('general.loginButton') }}
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <!-- 
      Side tabbar
     -->
    <div class="app-tabbar">
      <router-link
        v-for="item in nav"
        :key="item.name"
        :to="item.to"
        :disabled="isDisabled(item.name)"
        class="tabbar-item"
      >
        <component :is="item.icon" class="tabbar-item-icon" />
        <span class="tabbar-item-text">
          {{ $t(isDisabled(item.name) ? 'general.comingSoon' : item.titleKey) }}
        </span>
      </router-link>
    </div>
    <div class="app-page" v-if="hasData">
      <slot />
    </div>
    <AppFooter class="app-footer" />
  </div>
</template>

<script>
import {
  ROUTE_ATRIUM,
  ROUTE_SESSIONS,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_LOGIN,
  ROUTE_PROFILE
} from '../const'

import { mapState } from 'vuex'

import AppFooter from '@/components/AppFooter.vue'
import LanguageControl from '@/components/LanguageControl.vue'

import CoffeeChatIcon from '@/icons/coffee-chat.svg'
import HelpDeskIcon from '@/icons/help-desk.svg'
import AtriumIcon from '@/icons/atrium.svg'
import ScheduleIcon from '@/icons/schedule.svg'
import SessionsIcon from '@/icons/whats-on.svg'

import { setLocale } from '@/i18n'

const nav = [
  {
    name: 'atrium',
    icon: AtriumIcon,
    to: { name: ROUTE_ATRIUM },
    titleKey: 'atrium.title'
  },
  {
    name: 'sessions',
    icon: SessionsIcon,
    to: { name: ROUTE_SESSIONS },
    titleKey: 'sessions.title'
  },
  {
    name: 'schedule',
    icon: ScheduleIcon,
    to: { name: ROUTE_SCHEDULE },
    titleKey: 'schedule.title'
  },
  {
    name: 'coffeechat',
    icon: CoffeeChatIcon,
    to: { name: ROUTE_COFFEE_CHAT },
    titleKey: 'coffeechat.title'
  },
  {
    name: 'helpdesk',
    icon: HelpDeskIcon,
    to: { name: ROUTE_HELP },
    titleKey: 'help.title'
  }
]

export default {
  components: { AppFooter, LanguageControl },
  data() {
    return {
      showingMenu: false,
      loginRoute: { name: ROUTE_LOGIN },
      atriumRoute: { name: ROUTE_ATRIUM },
      sessionsRoute: { name: ROUTE_SESSIONS },
      scheduleRoute: { name: ROUTE_SCHEDULE },
      coffeeRoute: { name: ROUTE_COFFEE_CHAT },
      helpRoute: { name: ROUTE_HELP },
      profileRoute: { name: ROUTE_PROFILE },
      nav
    }
  },
  created() {
    if (this.user) {
      setLocale(this.user.user_lang, false)
    }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState']),
    scheduleLive() {
      return this.hasData && this.settings.scheduleLive
    },
    hasData() {
      return this.apiState === 'active'
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
      this.$refs.menuButton.classList.toggle('is-active', this.showingMenu)
      this.$refs.navbarMenu.classList.toggle('is-active', this.showingMenu)
    },
    onLocale(event) {
      setLocale(event.target.value, true)
    },
    isDisabled(tabName) {
      if (tabName === 'helpdesk') {
        return !(this.hasData && this.settings.enableHelpdesk)
      }

      const alwasyAllowed = new Set(['atrium', 'helpdesk'])
      const preSchedule = new Set(['atrium', 'helpdesk', 'sessions'])

      if (!this.user) return !alwasyAllowed.has(tabName)

      if (!this.scheduleLive) return !preSchedule.has(tabName)

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
$tabbar-width: 5.5rem;

.app-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  border-bottom: 1px solid $border;
}

@mixin link {
  &[disabled] {
    color: $grey-light;
    pointer-events: none;

    cursor: not-allowed;
  }

  @include desktop {
    &:hover:not([disabled]):not(.is-active) {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  &.is-active {
    color: $cc-coral;
    background-color: $cc-black;

    background-color: rgba(255, 255, 255, 1);
  }
}

.tabbar-item {
  font-size: $size-7;
  font-weight: bold;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: $white;

  margin: 6px;
  padding: 6px 0;
  border-radius: $radius-large;

  @include link;

  &[disabled] {
    color: #73788c;
  }

  .tabbar-item-text {
    text-align: center;
  }
  .tabbar-item-icon {
    height: 3rem;
    width: 3rem;
  }

  &:not(:last-child) {
    margin-bottom: 6px;
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
}

$tri-height: $navbar-height / 2;
$tri-width: $tri-height;
// $tri-width: $tabbar-width / 2;

.navbar-brand {
  &:before {
    content: '';
    display: inline-block;
    border-block-end: solid $tri-height $cc-coral;
    border-inline-start: solid $tri-width $cc-coral;
    border-inline-end: solid $tri-width $white;
    border-block-start: solid $tri-height $white;
  }
  @include desktop {
    border-inline-start: solid ($tabbar-width - $navbar-height) $cc-coral;
  }
  @include touch {
    &:before {
      border-width: $tri-height;
    }
  }

  .navbar-item {
    // margin-inline-start: $navbar-height;
  }
}

@include touch {
  .navbar-menu {
    padding: 0;
  }
  .navbar-menu .navbar-item {
    color: $white;
    background-color: $cc-black;
    font-weight: bold;

    &:hover:not(.is-active) {
      background-color: $grey-dark;
    }

    &.is-active {
      background-color: $grey-dark;
    }

    &[disabled] {
      color: $grey;
    }
  }
}

@include desktop {
  .app-tabbar {
    position: absolute;
    top: $navbar-height;
    bottom: 0;
    width: $tabbar-width;

    @include insetInlineStart(0);

    // inset-inline-start: 0;
    border-inline-end: 1px solid $black;

    display: flex;
    flex-direction: column;
  }
  .app-page {
    margin-inline-start: $tabbar-width;
    flex: 1;
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
  background: #252525;
}

.app-page {
  // ...
}

.app-footer {
}
</style>
