<template>
  <nav
    class="navbar has-border is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <!-- Logo -->
      <router-link :to="atriumRoute" class="navbar-item" active-class="">
        <img src="/img/brand-new.svg" alt="Home" width="160" height="28" />
      </router-link>

      <!-- Menu button (burger) -->
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
    <div :class="['navbar-menu', { 'is-active': showingMenu }]">
      <div class="navbar-start">
        <router-link
          v-for="item in currentNav"
          :key="item.name"
          :to="item.to"
          :disabled="tabIsDisabled(item.name)"
          :title="$t(item.titleKey)"
          class="navbar-item"
        >
          <component :is="item.icon" class="navbar-item-icon" />
          <span class="navbar-item-text">
            {{ $t(item.titleKey) }}
            <template v-if="!tabIsActive(item.name)">
              {{ '– ' + $t(disabledKey) }}
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
        <div v-if="isTranslator" class="navbar-item">
          <router-link class="button is-purple is-small" :to="interpretRoute">
            {{ $t('interpretHome.goto') }}
          </router-link>
        </div>
        <!-- Profile link -->
        <div v-if="user" class="navbar-item">
          <router-link
            class="button is-default is-small has-addons"
            :to="profileRoute"
          >
            <span class="icon">
              <fa :icon="['fas', 'user']" />
            </span>
            <span>{{ user.sub }}</span>
          </router-link>
        </div>
        <!-- Login button -->
        <div v-if="!user" class="navbar-item">
          <div class="buttons">
            <router-link class="button is-light is-small" :to="loginRoute">
              {{ $t('general.loginButton') }}
            </router-link>
            <!-- Register button -->
            <router-link class="button is-coral is-small" :to="registerRoute">
              {{ $t('general.registerButton') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
// Mixins
import NavigationMixin from '@/mixins/NavigationMixin.js'

// Components
import LanguageControl from '@/components/form/LanguageControl.vue'

export default {
  name: 'NavMenu',
  mixins: [NavigationMixin],
  components: { LanguageControl },
  data() {
    return {
      showingMenu: false
    }
  },
  methods: {
    toggleMenu() {
      this.showingMenu = !this.showingMenu
    }
  }
}
</script>

<style lang="scss" scoped>
$tri-height: $navbar-height / 2;
$tri-width: $tabbar-width / 2;

@include desktop {
  .navbar-start {
    display: none;
  }
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
    background-color: white;
  }
}

.navbar-brand {
  &:before {
    content: '';
    display: inline-block;
    border-block-end: solid $tri-height $cc-coral;
    border-block-start: solid $tri-height $white;
    border-inline-start: solid $tri-height $cc-coral;
    border-inline-end: solid $tri-height $white;
    @include desktop {
      border-inline-start: solid $tri-width $cc-coral;
      border-inline-end: solid $tri-width $white;
    }
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

@include touch {
  .ifrc-branding {
    display: none;
  }
}
</style>
