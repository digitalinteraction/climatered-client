<template>
  <div id="app">
    <router-view />
    <footer class="footer">
      <div class="content has-text-centered">
        <strong>{{ appName }}</strong>
        version {{ appVersion }}
        | Made by
        <a href="https://openlab.ncl.ac.uk">Openlab</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    const { token } = localStorage
    if (!token && this.$route.name !== 'Login') {
      this.$router.replace({ name: 'Login' })
    } else if (token) {
      this.$store.dispatch('api/fetchData', token)
    }
  },
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

<style lang="scss">
@import '~bulma/bulma.sass';

@include tablet {
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.embedded {
  background-color: #fafafa;
  border-radius: $radius;
  overflow: hidden;
  position: relative;

  > iframe {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
