<template>
  <div class="app-wrapper">
    <div class="app-header">
      <div class="app-header-start">
        <!--
            Navigation bar
        -->
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <router-link :to="{ name: 'home' }" class="navbar-item">
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
          <div class="navbar-menu" ref="navbarMenu">
            <div class="navbar-start">
              <router-link
                class="navbar-item"
                :to="atriumRoute"
                active-class="is-active"
              >
                <img class="navbar-item-icon" src="/img/icons/atrium.svg" />
                <span class="navbar-item-text">
                  {{ $t('atrium.navTitle') }}
                </span>
              </router-link>
              <router-link
                class="navbar-item"
                :to="scheduleRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <img
                  class="navbar-item-icon"
                  src="/img/icons/schedule-alt-2.svg"
                />
                <span class="navbar-item-text">
                  {{ $t('schedule.navTitle') }}
                </span>
              </router-link>
              <router-link
                class="navbar-item"
                :to="coffeeRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <img
                  class="navbar-item-icon"
                  src="/img/icons/coffee-chat.svg"
                />
                <span class="navbar-item-text">
                  {{ $t('coffeechat.navTitle') }}
                </span>
              </router-link>
              <router-link
                class="navbar-item"
                :to="helpRoute"
                :disabled="!user"
                active-class="is-active"
              >
                <img class="navbar-item-icon" src="/img/icons/helpdesk.svg" />
                <span class="navbar-item-text">
                  {{ $t('help.navTitle') }}
                </span>
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
            </div>
          </div>
        </nav>
      </div>
      <div class="app-header-end">
        <p>{{ user }}</p>
      </div>
    </div>
    <div class="app-tabbar">
      <router-link class="tabbar-item" :to="atriumRoute">
        <img class="tabbar-item-icon" src="/img/icons/atrium.svg" />
        <span class="tabbar-item-text">
          {{ $t('atrium.navTitle') }}
        </span>
      </router-link>
      <router-link class="tabbar-item" :to="scheduleRoute" :disabled="!user">
        <img class="tabbar-item-icon" src="/img/icons/schedule-alt-2.svg" />
        <span class="tabbar-item-text">
          {{ $t('schedule.navTitle') }}
        </span>
      </router-link>
      <router-link class="tabbar-item" :to="coffeeRoute" :disabled="!user">
        <img class="tabbar-item-icon" src="/img/icons/coffee-chat.svg" />
        <span class="tabbar-item-text">
          {{ $t('coffeechat.navTitle') }}
        </span>
      </router-link>
      <router-link class="tabbar-item" :to="helpRoute" :disabled="!user">
        <img class="tabbar-item-icon" src="/img/icons/helpdesk.svg" />
        <span class="tabbar-item-text">
          {{ $t('help.navTitle') }}
        </span>
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
  ROUTE_HELP
} from '../const'

export default {
  props: {
    user: { type: Object, default: null }
  },
  data() {
    return {
      showingMenu: false,
      atriumRoute: { name: ROUTE_ATRIUM },
      scheduleRoute: { name: ROUTE_SCHEDULE },
      coffeeRoute: { name: ROUTE_COFFEE_CHAT },
      helpRoute: { name: ROUTE_HELP }
    }
  },
  computed: {
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
      this.$emit('locale', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
$tabbar-width: 5rem;

.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.app-header {
  border-bottom: 1px solid $border;
}

.tabbar-item {
  font-size: $size-7;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: $greyish;

  .tabbar-item-text {
  }
  .tabbar-item-icon {
    height: 3rem;
    width: 3rem;
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  &[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }

  @include desktop {
    &:hover {
      background-color: $white-ter;
      color: $black;
    }
  }

  &.router-link-active {
    color: $link;
    font-weight: 600;
  }
}

.navbar-item {
  display: flex;
  align-items: center;
  color: $greyish;

  .navbar-item-icon {
    width: 3rem;
    height: 3rem;
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
