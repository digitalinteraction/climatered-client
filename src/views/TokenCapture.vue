<template>
  <p>Processing token...</p>
</template>

<script>
import { ROUTE_ATRIUM } from '../const'

export default {
  mounted() {
    const { token } = this.$route.query

    if (!token) return alert('No token passed')

    if (token === 'reset') {
      delete localStorage.token
      window.location.reload()
      return
    }

    window.localStorage.token = token

    this.$store.dispatch('api/authenticate', {
      socket: this.$socket,
      token
    })
    this.$router.replace({ name: ROUTE_ATRIUM })
  }
}
</script>
