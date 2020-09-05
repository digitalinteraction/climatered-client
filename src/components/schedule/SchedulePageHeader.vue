<template>
  <div class="schedule-page-header">
    <div class="page-header is-light">
      <div class="page-header-content">
        <!-- Title -->
        <h1 class="title">
          <slot name="title"></slot>
        </h1>

        <!-- Description -->
        <h4 class="description">
          <slot name="description"></slot>
        </h4>
      </div>
      <!-- Page controls -->
      <div class="page-controls-wrapper">
        <div class="page-controls">
          <slot name="controls"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SchedulePageHeader'
}
</script>

<style lang="scss" scoped>
.schedule-page-header {
  .page-header {
    .page-header-content {
      padding: 1.5em;
      padding-bottom: 0;

      .title {
        color: #515151;
        font-weight: bold;
        margin-bottom: 0;
      }
    }

    &.is-primary {
      background-color: $cc-coral;
      .title {
        color: white;
      }
      .description {
        color: white;
      }
    }
    &.is-light {
      background-color: white;
    }
  }
}
</style>
