<template>
  <div class="buttons has-addons">
    <button
      v-for="option in options"
      :key="option"
      @click="setOption(option)"
      class="button"
      :class="optionClasses(option)"
      :disabled="disabled"
    >
      {{ option }}
    </button>
  </div>
</template>

<script>
//
// A set of buttons where only one is selected
//

export default {
  props: {
    options: { type: Array, required: true },
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false }
  },
  methods: {
    setOption(option) {
      this.$emit('input', option)
    },
    optionClasses(option) {
      return {
        'is-primary': option === this.value
      }
    }
  }
}
</script>
