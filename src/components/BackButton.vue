<template>
  <router-link :to="to" class="button is-text">
    <span class="icon ltr-only">
      <fa :icon="['fas', 'arrow-left']" />
    </span>
    <span class="icon rtl-only">
      <fa :icon="['fas', 'arrow-right']" />
    </span>
    <span v-if="textKey" v-t="textKey" />
    <span v-else-if="text" v-text="text" />
  </router-link>
</template>

<script>
export default {
  props: {
    to: { type: [String, Object], required: true },
    text: { type: String, default: null },
    textKey: { type: String, default: null }
  }
}
</script>
