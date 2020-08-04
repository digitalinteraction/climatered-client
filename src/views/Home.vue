<template>
  <div class="home-page">
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title is-1">{{ $t('general.message') }}</h1>
          </div>
          <div class="column is-narrow">
            <button class="button is-danger is-light" @click="logout">
              Logout
            </button>
          </div>
        </div>

        <template v-if="isRole('attendee')">
          <h2 class="title">Attendee schedule</h2>
          <AttendeeSchedule
            :slots="$store.state.api.slots"
            :events="$store.state.api.sessions"
          />
        </template>

        <template v-if="isRole('translator')">
          <h2 class="title">Translator schedule</h2>
          <TranslatorSchedule
            :slots="$store.state.api.slots"
            :events="translatorEvents"
          />
        </template>

        <pre>{{ authToken }}</pre>
      </div>
    </section>
  </div>
</template>

<script>
import AttendeeSchedule from '@/components/AttendeeSchedule.vue'
import TranslatorSchedule from '@/components/TranslatorSchedule.vue'
import jwt from 'jsonwebtoken'

export default {
  name: 'Home',
  components: {
    AttendeeSchedule,
    TranslatorSchedule
  },
  computed: {
    authToken() {
      return jwt.decode(localStorage.token)
    },
    translatorEvents() {
      return this.$store.state.api.sessions?.filter(e => e.enableTranslation)
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
