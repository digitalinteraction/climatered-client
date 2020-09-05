<template>
  <div class="field">
    <label :for="name" class="checkbox" :class="labelClass">
      <input
        :id="name"
        type="checkbox"
        class="checkbox"
        :value="value"
        @change="onInput"
      />
      {{ $t(textKey) }}
    </label>
  </div>
</template>

<script>
//
// Wraps a bulma checkbox field
//

export default {
  props: {
    name: { type: String, required: true },
    value: { type: Boolean, required: true },
    textKey: { type: String, required: true },
    hasError: { type: Boolean, default: false }
  },
  computed: {
    labelClass() {
      return {
        'is-danger': this.hasError
      }
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox.is-danger {
  color: $danger;
}
</style>
