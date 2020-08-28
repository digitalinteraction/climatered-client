<template>
  <div class="stack" :class="classes">
    <slot />
  </div>
</template>

<script>
function enumProp(values) {
  return {
    type: String,
    validator: v => values.includes(v),
    required: true
  }
}

export default {
  props: {
    direction: enumProp(['horizontal', 'vertical']),
    gap: enumProp(['none', 'small', 'regular', 'medium', 'large']),
    align: enumProp(['start', 'end', 'center', 'stretch'])
  },
  computed: {
    classes() {
      return [
        `is-${this.gap}`,
        `is-${this.direction}`,
        `is-aligned-${this.align}`
      ]
    }
  }
}
</script>

<style lang="scss">
@mixin notLastChild {
  > *:not(:last-child) {
    @content;
  }
}

.stack {
  display: flex;
  align-items: center;

  &.is-horizontal {
    flex-direction: row;
  }
  &.is-vertical {
    flex-direction: column;
  }

  &.is-small {
    @include notLastChild() {
      margin-block-end: 4px;
    }
  }
  &.is-regular {
    @include notLastChild() {
      margin-block-end: 8px;
    }
  }
  &.is-medium {
    @include notLastChild() {
      margin-block-end: 18px;
    }
  }
  &.is-large {
    @include notLastChild() {
      margin-block-end: 32px;
    }
  }

  &.is-aligned-start {
    align-items: flex-start;
  }
  &.is-aligned-end {
    align-items: flex-end;
  }
  &.is-aligned-center {
    align-items: center;
  }
  &.is-aligned-stretch {
    align-items: stretch;
  }
}
</style>
