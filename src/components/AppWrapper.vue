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
              <router-link class="navbar-item" to="/">
                <img class="navbar-item-icon" src="/img/icons/atrium.svg" />
                <span class="navbar-item-text">Atrium</span>
              </router-link>
              <router-link class="navbar-item" to="/">
                <img
                  class="navbar-item-icon"
                  src="/img/icons/schedule-alt-2.svg"
                />
                <span class="navbar-item-text">Schedule</span>
              </router-link>
              <router-link class="navbar-item" to="/">
                <img
                  class="navbar-item-icon"
                  src="/img/icons/coffee-chat.svg"
                />
                <span class="navbar-item-text">Coffee chat</span>
              </router-link>
              <router-link class="navbar-item" to="/">
                <img class="navbar-item-icon" src="/img/icons/helpdesk.svg" />
                <span class="navbar-item-text">Help</span>
              </router-link>
            </div>
          </div>
        </nav>
      </div>
      <div class="app-header-end">
        <p>{{ user }}</p>
      </div>
    </div>
    <div class="app-tabbar">
      <router-link class="tabbar-item" to="/">
        <img class="tabbar-item-icon" src="/img/icons/atrium.svg" />
        <span class="tabbar-item-text">Atrium</span>
      </router-link>
      <router-link class="tabbar-item" to="/">
        <img class="tabbar-item-icon" src="/img/icons/schedule-alt-2.svg" />
        <span class="tabbar-item-text">Schedule</span>
      </router-link>
      <router-link class="tabbar-item" to="/">
        <img class="tabbar-item-icon" src="/img/icons/coffee-chat.svg" />
        <span class="tabbar-item-text">Coffee chat</span>
      </router-link>
      <router-link class="tabbar-item" to="/">
        <img class="tabbar-item-icon" src="/img/icons/helpdesk.svg" />
        <span class="tabbar-item-text">Help!</span>
      </router-link>
    </div>
    <div class="app-page">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, default: null }
  },
  data() {
    return {
      showingMenu: false
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
      this.$refs.menuButton.classList.toggle('is-active', this.showingMenu)
      this.$refs.navbarMenu.classList.toggle('is-active', this.showingMenu)
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

  @include desktop {
    &:hover {
      background-color: $white-ter;
      color: $black;
    }
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
}

@include desktop {
  .app-tabbar {
    position: absolute;
    top: $navbar-height;
    left: 0;
    bottom: 0;
    width: $tabbar-width;

    border-right: 1px solid $border;

    display: flex;
    flex-direction: column;
  }
  .app-page {
    margin-left: $tabbar-width;
  }
  .navbar-menu {
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
