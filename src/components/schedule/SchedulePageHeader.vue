<template>
  <div class="schedule-page-header">
    <div class="page-header is-light">
      <!-- Title -->
      <h1 class="title">
        <slot name="title"></slot>
      </h1>

      <!-- Description -->
      <h4 class="description">
        <slot name="description"></slot>
      </h4>

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
    background-color: $cc-lightestgrey;
    padding: 1.5em;

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

    .title {
      color: #515151;
      font-weight: bold;
      margin-bottom: 0;
    }
    .description {
      margin: 10px 0;
    }

    // Page controls
    .page-controls-wrapper {
      border-top: 1px solid $border;
      margin-top: 20px;
      padding-top: 20px;
      .page-controls {
        display: inline-block;
        margin-bottom: -15px;
        .field {
          margin-bottom: 0px;
        }
        .control {
          padding-bottom: 15px;
          .button {
            &.is-small {
              margin: 0;
            }
          }
          &:not(:last-child) {
            .select {
              &:dir(ltr) {
                margin-right: 15px;
              }
              &:dir(rtl) {
                margin-left: 15px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
