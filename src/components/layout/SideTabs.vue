<template>
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
        {{ $t(tabIsActive(item.name) ? item.titleKey : 'general.comingSoon') }}
      </span>
    </router-link>
  </div>
</template>

<script>
import NavigationMixin from '@/mixins/NavigationMixin.js'

export default {
  name: 'SideTabs',
  mixins: [NavigationMixin],
  props: {
    currentNav: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
@mixin link {
  &[disabled] {
    color: $grey-light;
    pointer-events: none;

    cursor: not-allowed;
  }

  @include desktop {
    &:hover:not([disabled]):not(.is-active) {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
}

@include desktop {
  .app-tabbar {
    position: fixed;
    top: $navbar-height;
    bottom: 0;
    width: $tabbar-width;
    z-index: $z-appwrapper-tabbar;

    @include insetInlineStart(0);

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
  background: #111;
  background-color: #252525;
  z-index: 2;
}

.tabbar-item {
  transition: 'border-color' 0.3s ease;
  // border-radius: 8px;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;

  font-size: $size-7;
  font-weight: bold;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: $white;

  margin: 0;
  padding: 12px 0;
  // padding-inline-start: 6px;
  // border-radius: $radius-large;

  // @include link;

  &[disabled] {
    opacity: 0.3;
  }

  .tabbar-item-text,
  .tabbar-item-icon {
    transition: all 0.3s ease;
    opacity: 0.8;
    pointer-events: none;
  }

  .tabbar-item-text {
    text-align: center;
  }
  .tabbar-item-icon {
    height: 3rem;
    width: 3rem;
  }

  &.is-active,
  &:hover {
    cursor: pointer !important;
    color: white;
    .tabbar-item-text {
      opacity: 1;
    }
    .tabbar-item-icon {
      opacity: 1;
    }
  }

  &.is-active {
    color: $cc-coral;
    color: white;
    background: rgba($color: #000000, $alpha: 0.2);
    // background-color: $cc-coral;
    // border-inline-start-color: white;
    border-inline-start-color: $cc-coral;
  }
}
</style>
