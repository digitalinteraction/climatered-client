<template>
  <div class="home-page">
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title is-1">Hello!</h1>
          </div>
          <div class="column is-narrow">
            <button class="button is-danger is-light" @click="logout">
              Logout
            </button>
          </div>
        </div>

        <h2 class="title">Conference schedule</h2>

        <template v-if="isRole('attendee')">
          <Schedule
            v-if="$store.state.api.hasData"
            :slots="$store.state.api.slots"
            :events="$store.state.api.events"
          />
        </template>

        <template v-if="isRole('translator')">
          <p>Hey translator</p>
        </template>

        <pre>{{ authToken }}</pre>
      </div>
    </section>
  </div>
</template>

<script>
import Schedule from '@/components/Schedule.vue'
import jwt from 'jsonwebtoken'

export default {
  name: 'Home',
  components: {
    Schedule
  },
  computed: {
    authToken() {
      return jwt.decode(localStorage.token)
    }
  },
  methods: {
    logout() {
      if (!window.confirm('Are you sure?')) return

      delete localStorage.token
      window.location.reload()
    },
    isRole(role) {
      return this.authToken?.user_roles?.includes(role)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
}
</style>
