<template>
  <input class="input" type="date" :value="dateValue" @input="onInput" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

const twoPad = (input: number) => input.toString().padStart(2, '0')

export default Vue.extend({
  props: {
    value: { type: Date as PropType<Date>, required: true },
  },
  computed: {
    dateValue(): string {
      return [
        this.value.getFullYear(),
        twoPad(this.value.getMonth() + 1),
        twoPad(this.value.getDate()),
      ].join('-')
    },
  },
  methods: {
    onInput(event: InputEvent) {
      const newValue = new Date(
        (event.target as HTMLInputElement).valueAsDate as Date
      )
      newValue.setMinutes(
        newValue.getMinutes() + newValue.getTimezoneOffset(),
        newValue.getSeconds(),
        newValue.getMilliseconds()
      )
      this.$emit('input', newValue)
    },
  },
})
</script>
