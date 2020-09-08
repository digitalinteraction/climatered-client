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
  mixins: [NavigationMixin]
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

.app-tabbar {
  background-color: #252525;
  position: fixed;
  top: $navbar-height;
  bottom: 0;
  width: $tabbar-width;
  z-index: $z-appwrapper-tabbar;

  @include insetInlineStart(0);

  display: flex;
  flex-direction: column;
}

@include touch {
  .app-tabbar {
    display: none;
  }
}

.tabbar-item {
  transition: 'background-color' 0.3s ease;

  font-size: $size-7;
  font-weight: bold;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: $white;

  margin: 6px;
  padding: 6px 0;
  border-radius: $radius-large;

  &[disabled] {
    opacity: 0.3;
    pointer-events: none;
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
    background-color: white;
    color: $cc-coral;
    border-inline-start-color: white;
    border-inline-start-color: $cc-coral;
  }
}
</style>
