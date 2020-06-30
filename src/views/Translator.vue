<template>
  <div class="translator-view">
    <h1 class="title">Translator - {{ eventId }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    eventId: { type: String, required: true }
  }
}
</script>
