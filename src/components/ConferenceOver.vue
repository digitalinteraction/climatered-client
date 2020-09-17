<template>
  <div
    v-if="conferenceIsOver"
    class="notification is-success has-text-weight-bold"
  >
    {{ $t('atrium.conferenceOver') }}
  </div>
</template>

<script>
export default {
  computed: {
    conferenceIsOver() {
      return Boolean(this.$store.state.api.settings.conferenceIsOver)
    }
  }
}
</script>
