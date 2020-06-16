<template>
  <p>Processing token...</p>
</template>

<script>
export default {
  mounted() {
    const { token } = this.$route.query

    if (!token) return alert('No token')

    if (token === 'reset') {
      delete window.localStorage.token
    } else {
      window.localStorage.token = token
    }

    this.$router.replace({ name: 'Home' })
  }
}
</script>
