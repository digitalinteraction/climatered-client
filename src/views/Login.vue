<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'login.backButton'"
    />
    <div slot="content" class="login-page">
      <h1 class="title" v-t="'login.title'" />
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
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM } from '../const'

export default {
  components: { UtilWrapper },
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

<style lang="scss" scoped></style>
