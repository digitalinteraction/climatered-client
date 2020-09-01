<template>
  <div class="schedule-section-header">
    <h1 class="title">
      <slot />
    </h1>
  </div>
</template>

<script>
export default {
  name: 'ScheduleSectionHeader'
}
</script>

<style lang="scss" scoped>
.schedule-section-header {
  background-color: white;
  border-bottom: 1px solid $border;
  border-top: 1px solid $border;

  padding: 0.75em 1.5em;

  // Positioning
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3;

  h1.title {
    line-height: 1em;
    font-size: 1.2em;
  }

  &.is-dark {
    background-color: #222;
    border: none;

    h1.title {
      color: white;
    }
  }

  &.is-primary {
    background-color: $cc-coral;
    border: none;

    h1.title {
      color: white;
    }
  }
}
</style>
