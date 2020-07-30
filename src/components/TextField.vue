<template>
  <div class="field">
    <label class="label" v-t="labelKey" :for="name" />
    <div class="control">
      <input
        :id="name"
        type="text"
        class="input"
        :class="inputClass"
        :value="value"
        @input="onInput"
        :placeholder="$t(placeholderKey)"
      />
    </div>
    <div class="help" v-if="helpKey" :class="inputClass">
      {{ $t(helpKey) }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    labelKey: { type: String, required: true },
    value: { type: String, required: true },
    placeholderKey: { type: String, required: true },
    helpKey: { type: String, default: null },
    hasError: { type: Boolean, default: false }
  },
  computed: {
    inputClass() {
      return {
        'is-danger': this.hasError
      }
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
