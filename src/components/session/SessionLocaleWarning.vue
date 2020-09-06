<template>
  <div
    v-if="displayLanguageNotification && !languageNotificationDismissed"
    class="notification is-danger is-light"
  >
    <span>{{ $t('session.sessionOnlyAvailableIn') }}</span>
    <span class="is-uppercase has-text-weight-semibold">
      {{ session.hostLanguage.join('/') }}
    </span>
    <button
      @click="languageNotificationDismissed = true"
      class="delete"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'SessionLocaleWarning',
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      languageNotificationDismissed: false
    }
  },
  computed: {
    displayLanguageNotification() {
      return (
        this.session.hostLanguage.length < 4 &&
        !this.session.hostLanguage.includes(this.$i18n.locale)
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
