<template>
  <AppWrapper>
    <div class="profile">
      <section class="section">
        <div class="box is-small">
          <h1 class="title" v-t="'profile.title'" />

          <div class="notification is-warning" v-if="!profile && debounced">
            {{ $t('profile.loadingText') }}
          </div>

          <table class="table" v-if="profile">
            <tbody>
              <tr>
                <th>{{ $t('profile.nameText') }}</th>
                <td>{{ profile.name }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.emailText') }}</th>
                <td>{{ user.sub }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.localeText') }}</th>
                <td>{{ user.user_lang | nameLanguage }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.registeredText') }}</th>
                <td>{{ profile.created | isoToDate | localeDateTime }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.whenText') }}</th>
                <td>{{ user.iat | iatToDate | localeDateTime }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.affiliationText') }}</th>
                <td>{{ profile.affiliation }}</td>
              </tr>
              <tr>
                <th>{{ $t('profile.countryText') }}</th>
                <td>{{ profile.country }}</td>
              </tr>
            </tbody>
          </table>

          <div class="buttons">
            <button
              class="button is-link"
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
import { STORAGE_TOKEN } from '@/const'

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
    isoToDate(value) {
      return new Date(value)
    },
    nameLanguage(value) {
      return languages[value]
    }
  },
  data() {
    return {
      profile: null,
      debounced: false
    }
  },
  async mounted() {
    setTimeout(() => {
      this.debounced = true
    }, 500)
    this.profile = await this.$store.dispatch('api/getProfile')
    if (!this.profile) alert('Something went wrong')
  },
  methods: {
    logout() {
      this.$gtag.event('logout', {
        event_category: 'users',
        event_label: 'User logged out',
        value: 0
      })

      delete localStorage[STORAGE_TOKEN]

      Vue.nextTick(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  @include appPageFlexFillChild;

  > .section {
    flex: 1;
    background-color: $cc-lightestgrey;
  }
}
</style>
