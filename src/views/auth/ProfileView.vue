<template>
  <BrandedUtilLayout>
    <div class="profileView">
      <h1 class="title">{{ $t('ifrc.profile.title') }}</h1>

      <table class="table" v-if="profile">
        <tbody>
          <tr>
            <th>{{ $t('ifrc.profile.nameText') }}</th>
            <td>{{ profile.name }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.emailText') }}</th>
            <td>{{ profile.email }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.localeText') }}</th>
            <td>{{ userLanguage }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.registeredText') }}</th>
            <td>{{ profileDate }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.whenText') }}</th>
            <td>{{ loggedInDate }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.affiliationText') }}</th>
            <td>{{ profile.affiliation }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.countryText') }}</th>
            <td>{{ profileCountry }}</td>
          </tr>
          <tr>
            <th>{{ $t('ifrc.profile.marketingText') }}</th>
            <td>{{ profileMarketing }}</td>
          </tr>
        </tbody>
      </table>

      <p class="profileView-heading">
        {{ $t('ifrc.profile.actionLabel') }}
      </p>

      <div class="buttons">
        <button class="button is-link" @click="logout">
          {{ $t('ifrc.profile.logoutButton') }}
        </button>
      </div>

      <template v-if="profile">
        <p class="profileView-heading">
          {{ $t('ifrc.profile.dangerLabel') }}
        </p>

        <div class="buttons">
          <button class="button is-danger" @click="unregister">
            {{ $t('ifrc.profile.deleteButton') }}
          </button>
        </div>
      </template>
    </div>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import { AuthToken } from '@openlab/deconf-shared'
import languageData from '@/data/languages.json'
import countryData from '@/data/countries-en.json'
import { StorageKey, UserData } from '@/lib/module'
import { mapApiState } from '@openlab/deconf-ui-toolkit'
import { TranslateResult } from 'vue-i18n'

interface FullAuthToken extends AuthToken {
  iat: number
  iss: string
}

export default Vue.extend({
  components: { BrandedUtilLayout },
  computed: {
    ...mapApiState('api', ['user', 'profile']),
    userLanguage(): string {
      if (!this.user) return 'Unknown'
      return languageData[this.user.user_lang] ?? 'Unknown'
    },
    profileDate(): string {
      return this.profile?.created.toLocaleString() ?? ''
    },
    loggedInDate(): string {
      if (!this.user) return 'Unknown'
      return new Date((this.user as FullAuthToken).iat).toLocaleString()
    },
    profileCountry(): string {
      if (!this.profile) return 'Unknown'
      return countryData.countries[this.profile.country]
    },
    profileMarketing(): TranslateResult {
      if (!this.profile) return 'Unknown'
      const userData = this.profile.userData as UserData
      return userData.marketing
        ? this.$t('ifrc.general.yes')
        : this.$t('ifrc.general.no')
    },
  },
  mounted() {
    this.$store.dispatch('api/fetchProfile')
  },
  methods: {
    logout() {
      // TODO: metrics

      localStorage.removeItem(StorageKey.AuthToken)

      Vue.nextTick(() => {
        window.location.reload()
      })
    },
    async unregister() {
      const msg = this.$t('ifrc.profile.deleteText')
      if (!confirm(msg as string)) return

      const success = await this.$store.dispatch('api/unregister')

      if (!success) {
        alert(this.$t('ifrc.general.genericError'))
        return
      }

      localStorage.removeItem(StorageKey.AuthToken)

      // TODO: metrics
      // IDEA: metrics for if they confirm or not?

      Vue.nextTick(() => {
        window.location.reload()
      })
    },
  },
})
</script>
