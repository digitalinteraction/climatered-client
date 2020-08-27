<template>
  <div class="select is-rounded" :class="selectClass">
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
