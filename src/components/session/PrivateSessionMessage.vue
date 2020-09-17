<template>
  <div class="session-private">
    <article class="message is-dark">
      <div class="message-header">
        {{ $t('session.privateLabel') }}
      </div>
      <div class="message-body">
        <div class="content">
          <p>
            {{ $t('session.privateBody') }}
          </p>
        </div>

        <div class="buttons is-centered">
          <router-link
            class="button is-light"
            :to="loginRoute"
            v-t="'login.title'"
          />
          <router-link
            class="button is-coral"
            :to="registerRoute"
            v-t="'register.title'"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { ROUTE_LOGIN, ROUTE_REGISTER } from '@/const'

export default {
  props: {
    session: { type: Object, required: true }
  },
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER }
    }
  }
}
</script>

<style lang="scss" scoped>
.session-private {
  .message {
    max-width: $tablet / 2;
    width: 100%;
    margin: 0 auto;
  }
  .message-body {
    border: 1px solid $border;
    border-top: none;
  }
  padding: 7rem 0;
  background-color: $cc-lightestgrey;
  border-radius: $radius-large;
}
</style>
