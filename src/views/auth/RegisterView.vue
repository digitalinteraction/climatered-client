<template>
  <BrandedUtilLayout>
    <div class="registerView" slot="main">
      <h1 class="title">{{ $t('ifrc.register.title') }}</h1>
      <div class="content">
        <p>{{ $t('ifrc.register.infoText') }}</p>
      </div>
      <div class="notification is-success" v-if="isSuccess">
        <button class="delete" @click="state = 'pending'"></button>
        <p>{{ $t('ifrc.register.doneText') }}</p>
      </div>
      <div class="notification is-danger" v-if="isError">
        <p>{{ $t('ifrc.login.badRegistration') }}</p>
      </div>
      <div class="registerView-form" v-if="state !== 'success'">
        <TextField
          type="text"
          name="name"
          :label="$t('ifrc.register.name.label')"
          :placeholder="$t('ifrc.register.name.placeholder')"
          :help="$t('ifrc.register.name.help')"
          :has-error="errors.name"
          :disabled="isWorking"
          v-model="registration.name"
        />
        <TextField
          type="text"
          name="email"
          :label="$t('ifrc.register.email.label')"
          :placeholder="$t('ifrc.register.email.placeholder')"
          :help="$t('ifrc.register.email.help')"
          :has-error="errors.email"
          :disabled="isWorking"
          v-model="registration.email"
        />
        <SelectField
          name="language"
          :label="$t('ifrc.register.language.label')"
          :help="$t('ifrc.register.language.help')"
          :has-error="errors.language"
          :disabled="isWorking"
          :value="registration.language"
          @input="onLanguage"
          :options="languageOptions"
          :not-selected="$t('ifrc.general.notSelected')"
        />
        <SelectField
          name="country"
          :label="$t('ifrc.register.country.label')"
          :help="$t('ifrc.register.country.help')"
          :has-error="errors.country"
          :disabled="isWorking"
          v-model="registration.country"
          :options="countryOptions"
          :not-selected="$t('ifrc.general.notSelected')"
        />
        <TextField
          type="text"
          name="affiliation"
          :label="$t('ifrc.register.affiliation.label')"
          :placeholder="$t('ifrc.register.affiliation.placeholder')"
          :help="$t('ifrc.register.affiliation.help')"
          :has-error="errors.affiliation"
          :disabled="isWorking"
          v-model="registration.affiliation"
        />
        <CheckboxField
          name="consent"
          v-model="registration.consent"
          :text="$t('ifrc.register.consentText')"
          :has-error="errors.consent"
          :disabled="isWorking"
        />
        <div class="content">
          <ul>
            <li>
              <a target="_blank" :href="termsHref">
                {{ $t('ifrc.register.termsLink') }}
              </a>
            </li>
            <li>
              <a target="_blank" :href="privacyHref">
                {{ $t('ifrc.register.privacyLink') }}
              </a>
            </li>
          </ul>
        </div>
        <div class="buttons">
          <button
            class="button is-primary"
            @click="submit"
            :disabled="isWorking"
          >
            {{ $t('ifrc.register.submitButton') }}
          </button>
        </div>
        <hr />
        <div class="content">
          <p>
            {{ $t('ifrc.register.loginLabel') }}
            <router-link :to="loginRoute">
              {{ $t('ifrc.register.loginAction') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import {
  TextField,
  SelectField,
  CheckboxField,
} from '@openlab/deconf-ui-toolkit'
import { pause, RegisterRequest } from '@/lib/module'
import countryData from '@/data/countries-en.json'
import languageData from '@/data/languages.json'
import { lib } from '@openlab/deconf-ui-toolkit'

const countryOptions = lib.deepSeal(
  Object.entries(countryData.countries).map(([value, text]) => ({
    value,
    text,
  }))
)

const languageOptions = lib.deepSeal(
  Object.entries(languageData).map(([value, text]) => ({ value, text }))
)

type Boolify<T extends unknown> = {
  [k in keyof T]: boolean
}

type Registration = RegisterRequest & {
  consent: boolean
}

interface Data {
  state: 'pending' | 'working' | 'success' | 'error'
  registration: Registration
  errors: Boolify<Registration>
  languageOptions: unknown
  countryOptions: unknown
}

function isEmail(input: string) {
  return /.+@.+/.test(input)
}

function createRegistration(locale: string): Registration {
  return {
    name: '',
    email: '',
    country: '',
    language: locale,
    affiliation: '',
    consent: false,
  }
}
function createErrors(): Boolify<Registration> {
  return {
    name: false,
    email: false,
    country: false,
    language: false,
    affiliation: false,
    consent: false,
  }
}

export default Vue.extend({
  components: { BrandedUtilLayout, TextField, SelectField, CheckboxField },
  data(): Data {
    return {
      state: 'pending',
      registration: createRegistration(this.$i18n.locale),
      errors: createErrors(),
      languageOptions: languageOptions,
      countryOptions,
    }
  },
  computed: {
    isPending(): boolean {
      return this.state === 'pending'
    },
    isWorking(): boolean {
      return this.state === 'working'
    },
    isSuccess(): boolean {
      return this.state === 'success'
    },
    isError(): boolean {
      return this.state === 'error'
    },
    termsHref(): string {
      return this.$router.resolve({ name: lib.Routes.Terms }).href
    },
    privacyHref(): string {
      return this.$router.resolve({ name: lib.Routes.Privacy }).href
    },
    loginRoute(): Location {
      return { name: lib.Routes.Login }
    },
    hasFormErrors(): boolean {
      for (const key in this.errors) {
        if (this.errors[key as keyof Registration]) return true
      }
      return false
    },
  },
  methods: {
    onLanguage(language: string) {
      this.registration.language = language
      this.$i18n.locale = language
    },
    async submit() {
      this.errors = this.findErrors(this.registration)
      if (this.hasFormErrors) {
        this.state = 'error'
        return
      }

      this.state = 'working'
      await pause(300)

      const body = { ...this.registration, consent: undefined }
      const success = await this.$store.dispatch('api/register', body)

      this.state = success ? 'success' : 'error'

      // TODO: metrics
    },
    findErrors(reg: Registration) {
      const errors = createErrors()
      const langSet = new Set(Object.keys(languageData))

      if (!reg.name || reg.name.length < 2) {
        errors.name = true
      }
      if (!reg.email || !isEmail(reg.email)) {
        errors.email = true
      }
      if (!reg.language || !langSet.has(reg.language)) {
        errors.language = true
      }
      if (!reg.country) {
        errors.country = true
      }
      if (!reg.affiliation) {
        errors.affiliation = true
      }
      if (!reg.consent) {
        errors.consent = true
      }
      return errors
    },
  },
})
</script>
