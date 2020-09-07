<template>
  <AppWrapper>
    <div class="profile">
      <section class="section">
        <div class="box is-small">
          <h1 class="title" v-t="'profile.title'" />

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
                <td>{{ countryName }}</td>
              </tr>
            </tbody>
          </table>

          <div v-if="!profile" class="notification is-warning is-light">
            {{ $t('profile.translatorMessage') }}
          </div>

          <p class="actions-label" v-t="'profile.actionLabel'" />

          <div class="buttons">
            <button
              class="button is-link"
              @click="logout"
              v-t="'profile.logoutButton'"
            />
          </div>

          <template v-if="profile">
            <hr />

            <p class="actions-label" v-t="'profile.dangerLabel'" />

            <button
              class="button is-danger"
              @click="deleteProfile"
              v-t="'profile.deleteButton'"
            />
          </template>
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
import countriesEn from '@/data/countries-en.json'
import languages from '@/data/languages.json'

export default {
  components: { AppWrapper },
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
  computed: {
    ...mapState('api', ['user', 'profile']),
    countryName() {
      const upperCode = this.profile.country.toUpperCase()
      return (this.profile && countriesEn.countries[upperCode]) || upperCode
    }
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
    },
    async deleteProfile() {
      const msg = this.$i18n.t('profile.deleteText')
      if (!confirm(msg)) return

      const deleted = await this.$store.dispatch('api/unregister')

      if (!deleted) {
        alert(this.$i18n.t('register.genericError'))
        return
      }

      delete localStorage[STORAGE_TOKEN]

      this.$gtag.event('deleted', {
        event_category: 'users',
        event_label: 'User deleted account',
        value: 0
      })

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

.actions-label {
  font-weight: bold;
  margin-bottom: 0.3em;
}
</style>
