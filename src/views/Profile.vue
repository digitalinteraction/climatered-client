<template>
  <AppWrapper>
    <div class="profile">
      <section class="section">
        <div class="container">
          <h1 class="title" v-t="'profile.title'" />

          <table class="table">
            <tbody>
              <tr>
                <th>{{ $t('profile.emailText') }}</th>
                <td>{{ user.sub }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.localeText') }}</th>
                <td>{{ user.user_lang | nameLanguage }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.whenText') }}</th>
                <td>{{ user.iat | iatToDate | localeDateTime }}</td>
              </tr>
            </tbody>
          </table>

          <div class="buttons">
            <button
              class="button is-danger"
              @click="logout"
              v-t="'profile.logoutButton'"
            />
          </div>
        </div>
      </section>
    </div>
  </AppWrapper>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import AppWrapper from '@/components/AppWrapper.vue'

const languages = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'عربى'
}

export default {
  components: { AppWrapper },
  computed: {
    ...mapState('api', ['user'])
  },
  filters: {
    iatToDate(value) {
      return new Date(value * 1000)
    },
    nameLanguage(value) {
      return languages[value]
    }
  },
  methods: {
    logout() {
      this.$gtag.event('logout', {
        event_category: 'users',
        event_label: 'User logged out',
        value: 0
      })

      delete localStorage.token

      Vue.nextTick(() => {
        window.location.reload()
      })
    }
  }
}
</script>
