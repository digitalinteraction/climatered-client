<template>
  <BrandedUtilLayout>
    <ProfileView
      v-if="user && profile"
      api-module="api"
      :fields="fields"
      @logout="logout"
      @unregister="unregister"
    />
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
import { ProfileView } from '@openlab/deconf-ui-toolkit'

interface FullAuthToken extends AuthToken {
  iat: number
  iss: string
}

// TODO: expose in deconf-ui
interface ProfileField {
  label: TranslateResult
  value: unknown
}

export default Vue.extend({
  components: { BrandedUtilLayout, ProfileView },
  computed: {
    ...mapApiState('api', ['user', 'profile']),
    fields(): ProfileField[] {
      if (!this.user || !this.profile) return []

      return [
        {
          label: this.$t('deconf.profile.ifrc.nameText'),
          value: this.profile.name,
        },
        {
          label: this.$t('deconf.profile.ifrc.emailText'),
          value: this.profile.email,
        },
        {
          label: this.$t('deconf.profile.ifrc.localeText'),
          value: languageData[this.user.user_lang],
        },
        {
          label: this.$t('deconf.profile.ifrc.registeredText'),
          value: this.profile.created.toLocaleString(),
        },
        {
          label: this.$t('deconf.profile.ifrc.whenText'),
          value: this.iatToString((this.user as FullAuthToken).iat),
        },
        {
          label: this.$t('deconf.profile.ifrc.affiliationText'),
          value: this.profile.affiliation,
        },
        {
          label: this.$t('deconf.profile.ifrc.countryText'),
          value: countryData.countries[this.profile.country],
        },
        {
          label: this.$t('deconf.profile.ifrc.marketingText'),
          value: this.boolToString(
            (this.profile.userData as UserData).marketing
          ),
        },
      ]
    },
  },
  mounted() {
    this.$store.dispatch('api/fetchProfile')
  },
  methods: {
    iatToString(iat: number) {
      const date = new Date(iat * 1000)
      date.setMinutes(
        date.getMinutes() + date.getTimezoneOffset(),
        date.getSeconds(),
        date.getMilliseconds()
      )
      return date.toLocaleString()
    },
    boolToString(value: boolean) {
      return value ? this.$t('ifrc.general.yes') : this.$t('ifrc.general.no')
    },
    logout() {
      localStorage.removeItem(StorageKey.AuthToken)

      setTimeout(() => {
        window.location.reload()
      }, 500)
    },
    async unregister() {
      localStorage.removeItem(StorageKey.AuthToken)

      setTimeout(() => {
        window.location.reload()
      }, 500)
    },
  },
})
</script>

<style lang="scss">
.profileView-heading {
  font-weight: bold;
  font-size: $size-5;
  margin-bottom: 0.3em;
}
</style>
