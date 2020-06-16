<template>
  <div class="login-page">
    <section class="section is-large">
      <div class="container is-small">
        <div class="box is-centered">
          <h1 class="title">Login</h1>
          <div class="content">
            <p>
              We'll send you an email to confirm who you are. The email will
              have a link in it which will log you in. It will expire after 30
              minutes.
            </p>
          </div>

          <div class="login-form" v-if="!done">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="email"
                  placeholder="geoff@example.com"
                />
              </div>
              <p class="help">
                The email address you registered to the conference with
              </p>
            </div>
            <div class="buttons">
              <button class="button is-primary" @click="submit">
                Request login code
              </button>
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
export default {
  data() {
    return {
      email: '',
      done: false
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
