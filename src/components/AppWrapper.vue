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
                v-for="item in currentNav"
                :key="item.name"
                :to="item.to"
                :disabled="tabIsDisabled(item.name)"
                class="navbar-item"
              >
                <component :is="item.icon" class="navbar-item-icon" />
                <span class="navbar-item-text">
                  {{ $t(item.titleKey) }}
                  <template v-if="!tabIsActive(item.name)">
                    {{ '– ' + $t('general.comingSoon') }}
                  </template>
                </span>
              </router-link>
            </div>
            <div class="navbar-end">
              <div class="navbar-item ifrc-branding">
                <img
                  src="/sponsor/solferino-academy.svg"
                  alt="IFRC Solferino academy"
                  width="110"
                  height="28"
                />
              </div>
              <div class="navbar-item">
                <LanguageControl />
              </div>
              <!-- Interpret link if role is set -->
              <router-link
                class="navbar-item"
                v-if="isTranslator"
                :to="interpretRoute"
              >
                {{ $t('interpretHome.goto') }}
              </router-link>
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
        v-for="item in currentNav"
        :key="item.name"
        :to="item.to"
        :disabled="tabIsDisabled(item.name)"
        class="tabbar-item"
      >
        <component :is="item.icon" class="tabbar-item-icon" />
        <span class="tabbar-item-text">
          {{
            $t(tabIsActive(item.name) ? item.titleKey : 'general.comingSoon')
          }}
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
//
// A wrapper for most pages on the site.
// adding nav, tabs and a <slot> for the page
// and only displays <slot> when data has been fetched
//

import {
  ROUTE_ATRIUM,
  ROUTE_SESSIONS,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_LOGIN,
  ROUTE_PROFILE,
  ROUTE_INTERPRET_HOME
} from '../const'

import { mapState } from 'vuex'

import AppFooter from '@/components/AppFooter.vue'
import LanguageControl from '@/components/form/LanguageControl.vue'

import CoffeeChatIcon from '@/icons/coffee-chat.svg'
import HelpDeskIcon from '@/icons/help-desk.svg'
import AtriumIcon from '@/icons/atrium.svg'
import ScheduleIcon from '@/icons/schedule.svg'
import SessionsIcon from '@/icons/whats-on.svg'

const nav = [
  {
    name: 'atrium',
    icon: AtriumIcon,
    to: { name: ROUTE_ATRIUM },
    titleKey: 'atrium.title',
    public: true
  },
  {
    name: 'sessions',
    icon: SessionsIcon,
    to: { name: ROUTE_SESSIONS },
    titleKey: 'sessions.title',
    public: false
  },
  {
    name: 'schedule',
    icon: ScheduleIcon,
    to: { name: ROUTE_SCHEDULE },
    titleKey: 'schedule.title',
    public: false
  },
  {
    name: 'coffeechat',
    icon: CoffeeChatIcon,
    to: { name: ROUTE_COFFEE_CHAT },
    titleKey: 'coffeechat.title',
    public: false
  },
  {
    name: 'helpdesk',
    icon: HelpDeskIcon,
    to: { name: ROUTE_HELP },
    titleKey: 'help.title',
    public: false
  }
]

const publicTabs = new Set(['atrium'])

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
      interpretRoute: { name: ROUTE_INTERPRET_HOME },
      nav
    }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState']),
    scheduleLive() {
      return this.hasData && this.settings.scheduleLive
    },
    hasData() {
      return this.apiState === 'active'
    },
    isTranslator() {
      return this.user?.user_roles.includes('translator')
    },
    currentNav() {
      const filterOut = new Set()

      if (this.scheduleLive) filterOut.add('sessions')
      else filterOut.add('schedule')

      return nav.filter(item => !filterOut.has(item.name))
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
      this.$refs.menuButton.classList.toggle('is-active', this.showingMenu)
      this.$refs.navbarMenu.classList.toggle('is-active', this.showingMenu)
    },
    /** Wether a tab should be shown or "coming-soon" */
    tabIsActive(tabName) {
      // The helpdesk is tied to its own setting
      if (tabName === 'helpdesk') return this.settings?.enableHelpdesk

      // The coffeechat is tied to its own setting
      if (tabName === 'coffeechat') return this.settings?.enableCoffeechat

      // If the schedule is live any other tab is enabled
      // otherwise only public tabs are enabled
      return this.scheduleLive || publicTabs.has(tabName)
    },
    /** Whether the current user can access a tab */
    tabIsAllowed(tabName) {
      return this.user || publicTabs.has(tabName)
    },
    tabIsDisabled(tabName) {
      return !this.tabIsActive(tabName) || !this.tabIsAllowed(tabName)
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
$tri-width: $tabbar-width / 2;

.navbar-brand {
  &:before {
    content: '';
    display: inline-block;
    border-block-end: solid $tri-height $cc-coral;
    border-inline-start: solid $tri-width $cc-coral;
    border-inline-end: solid $tri-width $white;
    border-block-start: solid $tri-height $white;
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
    background: $cc-black;
    padding: 12px 0;
  }
  .navbar-end {
    border-top: 1px solid $grey-dark;
    padding-top: 12px;
  }
  .navbar-menu .navbar-item {
    color: $white;
    margin: 0 12px 0;
    border-radius: $radius;
    font-weight: bold;

    &:hover:not(.is-active) {
      background-color: inherit;
    }

    &.is-active {
      color: $cc-coral;
      background-color: $white;
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
    z-index: $z-appwrapper-tabbar;

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
  z-index: 2;
}

@include touch {
  .ifrc-branding {
    display: none;
  }
}

.app-page {
  // ...
}

.app-footer {
}
</style>
