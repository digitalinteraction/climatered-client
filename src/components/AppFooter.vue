<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <strong>{{ appName }}</strong>
      version {{ appVersion }}
      | Made by
      <a href="https://openlab.ncl.ac.uk">Openlab</a>
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
