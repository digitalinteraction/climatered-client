<template>
  <div class="login-page">
    <div class="buttons">
      <router-link
        class="button is-text"
        :to="atriumRoute"
        v-t="'login.backButton'"
      />
    </div>
    <section class="section is-large">
      <div class="container is-small">
        <div class="box is-centered">
          <h1 class="title" v-t="'login.displayTitle'" />
          <div class="content">
            <p>{{ $t('login.infoText') }}</p>
          </div>

          <div class="login-form" v-if="!done">
            <div class="field">
              <label class="label" v-t="'login.emailLabel'"></label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="email"
                  :placeholder="$t('login.emailPlaceholder')"
                  @keyup.enter="submit"
                />
              </div>
              <p class="help">
                {{ $t('login.emailHelp') }}
              </p>
            </div>
            <div class="buttons">
              <button
                class="button is-primary"
                @click="submit"
                v-t="'login.submitButton'"
              />
            </div>
          </div>
          <div class="notification is-success is-large" v-else>
            <button class="delete" @click="done = false"></button>
            <strong>Login code sent</strong>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ROUTE_ATRIUM } from '../const'

export default {
  data() {
    return {
      email: '',
      done: false,
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  },
  methods: {
    async submit() {
      if (!this.email) return alert('No email entered')
      const agent = this.$store.getters['api/agent']

      try {
        const searchParams = { email: this.email }

        const res = await agent('login/email', { searchParams })
        const json = await res.json()

        this.done = res.ok
        if (!res.ok) throw new Error(json.message)

        this.done = true
      } catch (error) {
        console.error(error)
        alert(error.message)
        this.done = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $grey-lightest;

  .box {
    max-width: $tablet;
    margin: 0 auto;
  }
}
</style>
