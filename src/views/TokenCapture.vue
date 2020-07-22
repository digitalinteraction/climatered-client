<template>
  <p>Processing token...</p>
</template>

<script>
import { authenticateSocket } from '../plugins/sockets.js'
import { ROUTE_ATRIUM } from '../const'

export default {
  mounted() {
    console.log(token)
    const { token } = this.$route.query

    console.log(token)

    if (!token) return alert('No token')

    if (token === 'reset') {
      delete window.localStorage.token
    } else {
      window.localStorage.token = token
      authenticateSocket(this.$socket, token)
    }

    this.$router.replace({ name: ROUTE_ATRIUM })
  }
}
</script>
