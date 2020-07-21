<template>
  <p>Processing token...</p>
</template>

<script>
import { authenticateSocket } from '../plugins/sockets.js'

export default {
  mounted() {
    const { token } = this.$route.query

    if (!token) return alert('No token')

    if (token === 'reset') {
      delete window.localStorage.token
    } else {
      window.localStorage.token = token
      authenticateSocket(this.$socket, token)
    }

    this.$router.replace({ name: 'Home' })
  }
}
</script>
