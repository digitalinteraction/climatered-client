<template>
  <div :class="['select']">
    <select
      :value="$i18n.locale"
      @input="onLocale"
      aria-label="Change the language"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="es">ES</option>
      <option value="ar">AR</option>
      <option v-if="isDev" value="dev">_DEV</option>
    </select>
  </div>
</template>

<script>
//
// A generic site language control, will update their local preference
//

import { overrideLocale } from '@/i18n'

export default {
  props: {
    selectClass: { type: String, default: '' }
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    onLocale(event) {
      overrideLocale(event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
$select-height: 36px;
$select-lineheight: 20px;
.select,
.select select {
  height: $select-height !important;
  line-height: $select-lineheight !important;
}
</style>
