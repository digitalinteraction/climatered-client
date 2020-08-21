<template>
  <p>Processing token...</p>
</template>

<script>
import { ROUTE_ATRIUM, STORAGE_TOKEN } from '@/const'

export default {
  mounted() {
    const { token } = this.$route.query

    if (!token) return alert('No token passed')

    if (token === 'reset') {
      delete localStorage[STORAGE_TOKEN]
      window.location.reload()
      return
    }

    localStorage[STORAGE_TOKEN] = token

    this.$store.dispatch('api/authenticate', {
      socket: this.$socket,
      token
    })
    this.$router.replace({ name: ROUTE_ATRIUM })

    this.$gtag.event('login-finish', {
      event_category: 'users',
      event_label: 'User successfully in',
      value: 0
    })
  }
}
</script>
