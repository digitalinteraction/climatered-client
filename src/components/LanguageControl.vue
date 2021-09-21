<template>
  <div class="select is-small">
    <select :value="$i18n.locale" @input="onInput">
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="es">ES</option>
      <option value="ar">AR</option>
    </select>
  </div>
</template>

<script lang="ts">
import { setLocale } from '@/i18n/module'
import Vue from 'vue'

export default Vue.extend({
  methods: {
    onInput(e: InputEvent) {
      setLocale((e.target as HTMLSelectElement).value)
    },
  },
})
</script>
