<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />
    <div slot="content">
      <div class="content">
        <h1>{{ $t('errors.title') }}</h1>
        <p v-if="errorKey">{{ $t(errorKey) }}</p>
      </div>
      <div class="buttons">
        <router-link
          class="button is-link"
          v-if="errorType === 'loginError'"
          :to="loginRoute"
          v-t="'login.title'"
        />
      </div>
    </div>
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import { ROUTE_ATRIUM, ROUTE_LOGIN } from '@/const'

const errorKeys = {
  loginError: 'errors.loginExpired'
}

export default {
  components: { UtilWrapper },
  data() {
    return {
      message: this.$route.query.message ?? 'Something went wrong',
      atriumRoute: { name: ROUTE_ATRIUM },
      loginRoute: { name: ROUTE_LOGIN }
    }
  },
  computed: {
    errorType() {
      if (this.message === 'jwt expired') return 'loginError'
      if (this.message === 'Bad token') return 'loginError'

      return 'general'
    },
    errorKey() {
      return errorKeys[this.errorType] ?? 'errors.general'
    }
  }
}
</script>
