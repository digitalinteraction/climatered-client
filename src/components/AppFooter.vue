<template>
  <footer class="footer">
    <div class="content has-text-centered">
      Made by
      <a href="https://openlab.ncl.ac.uk">Openlab</a>
      /
      {{ $t('general.appName') }}
      v{{ appVersion }}
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    appName() {
      return process.env.VUE_APP_NAME
    },
    appVersion() {
      return process.env.VUE_APP_VERSION
    }
  }
}
</script>

<style lang="scss" scoped>
.footer .content {
  color: $grey;
  a {
    font-weight: bold;
  }
}
</style>
