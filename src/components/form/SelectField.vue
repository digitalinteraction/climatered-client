<template>
  <div class="field">
    <label class="label" v-t="labelKey" :for="name" />
    <div class="control">
      <div class="select" :class="selectClass">
        <select :value="value" @input="onInput" :id="name">
          <option disabled selected value="">{{
            $t('general.pleaseSelect')
          }}</option>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            <template v-if="option.labelKey">
              {{ $t(option.labelKey) }}
            </template>
            <template v-if="option.label">
              {{ option.label }}
            </template>
          </option>
        </select>
      </div>
    </div>
    <div class="help" v-if="helpKey" :class="selectClass">
      {{ $t(helpKey) }}
    </div>
  </div>
</template>

<script>
//
// Wraps a bulma select field
//

export default {
  props: {
    name: { type: String, required: true },
    labelKey: { type: String, required: true },
    value: { type: String, required: true },
    helpKey: { type: String, default: null },
    options: { type: Array, required: true },
    hasError: { type: Boolean, default: false }
  },
  computed: {
    selectClass() {
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
