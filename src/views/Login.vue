<template>
  <UtilWrapper>
    <BackButton
      slot="back-button"
      :to="atriumRoute"
      text-key="atrium.returnTo"
    />
    <div slot="content" class="login-page">
      <h1 class="title" v-t="'login.title'" />
      <div class="content">
        <p>{{ $t('login.infoText') }}</p>
      </div>

      <div class="login-form" v-if="!done">
        <TextField
          name="email"
          type="email"
          v-model="email"
          :has-error="hasError"
          label-key="login.email.label"
          placeholder-key="login.email.placeholder"
          help-key="login.email.help"
          @enter="submit"
        />
        <div class="buttons">
          <button
            class="button is-coral is-modern"
            @click="submit"
            v-t="'login.submitButton'"
          />
        </div>
        <hr />
        <p>
          {{ $t('login.registerLabel') }}
          <router-link class="has-text-weight-bold" :to="registerRoute">
            {{ $t('login.registerAction') }}
          </router-link>
        </p>
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
import BackButton from '@/components/BackButton.vue'
import TextField from '@/components/form/TextField.vue'
import { ROUTE_ATRIUM, ROUTE_REGISTER } from '../const'

export default {
  components: { UtilWrapper, TextField, BackButton },
  data() {
    return {
      email: '',
      done: false,
      atriumRoute: { name: ROUTE_ATRIUM },
      registerRoute: { name: ROUTE_REGISTER },
      hasError: false
    }
  },
  methods: {
    async submit() {
      if (!this.email) {
        this.hasError = true
        return
      }

      try {
        const passed = await this.$store.dispatch('api/login', this.email)

        this.hasError = !passed

        if (!passed) return

        this.$gtag.event('login-start', {
          event_category: 'users',
          event_label: 'User requested login code',
          value: 0
        })

        this.done = true
      } catch (error) {
        console.error(error)
        this.hasError = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
