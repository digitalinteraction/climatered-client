<template>
  <UtilWrapper>
    <router-link
      slot="back-button"
      class="button is-text"
      :to="atriumRoute"
      v-t="'atrium.returnTo'"
    />

    <div slot="content" class="register-page">
      <h1 class="title" v-t="'register.title'" />
      <div class="content">
        <p>{{ $t('register.infoText') }}</p>
      </div>

      <div class="register-form" v-if="!done">
        <TextField
          name="fullName"
          v-model="registration.name"
          :has-error="errors.name"
          label-key="register.name.label"
          placeholder-key="register.name.placeholder"
          help-key="register.name.help"
        />
        <TextField
          name="email"
          type="email"
          v-model="registration.email"
          :has-error="errors.email"
          label-key="register.email.label"
          placeholder-key="register.email.placeholder"
          help-key="register.email.help"
        />
        <SelectField
          name="language"
          :value="registration.language"
          @input="onLanguage"
          :has-error="errors.language"
          label-key="register.language.label"
          help-key="register.language.help"
          :options="languages"
        />
        <SelectField
          name="country"
          v-model="registration.country"
          :has-error="errors.country"
          label-key="register.country.label"
          help-key="register.country.help"
          :options="countries"
        />
        <TextField
          name="affiliation"
          v-model="registration.affiliation"
          :has-error="errors.affiliation"
          label-key="register.affiliation.label"
          placeholder-key="register.affiliation.placeholder"
          help-key="register.affiliation.help"
        />
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" v-model="hasConsented" />
            {{ $t('register.consentText') }}
          </label>
        </div>
        <div class="content">
          <ul>
            <!-- <li>
              <a href="/terms" target="_blank" v-t="'register.termsLink'" />
            </li> -->
            <li>
              <a href="/privacy" target="_blank" v-t="'register.privacyLink'" />
            </li>
          </ul>
        </div>
        <div class="buttons">
          <button
            class="button is-primary"
            @click="submit"
            v-t="'register.submitButton'"
          />
        </div>
      </div>
      <div class="notification is-success is-large" v-else>
        <button class="delete" @click="done = false"></button>
        <strong>{{ $t('register.doneText') }}</strong>
      </div>
    </div>
  </UtilWrapper>
</template>

<script>
import UtilWrapper from '@/components/UtilWrapper.vue'
import TextField from '@/components/TextField.vue'
import SelectField from '@/components/SelectField.vue'

import { ROUTE_ATRIUM } from '../const'
import { setLocale } from '../i18n'

import isEmail from 'is-email'
import countries from 'i18n-iso-countries'
import countriesEn from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(countriesEn)

const countryOptions = Object.entries(countries.getNames('en')).map(
  ([key, text]) => ({
    value: key,
    label: text
  })
)

export default {
  components: { UtilWrapper, TextField, SelectField },
  data() {
    return {
      done: false,
      atriumRoute: { name: ROUTE_ATRIUM },
      registration: {
        name: '',
        email: '',
        language: this.$i18n.locale,
        country: '',
        affiliation: ''
      },
      errors: {
        name: false,
        email: false,
        language: false,
        country: false,
        affiliation: false
      },
      hasConsented: false,
      languages: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
        { value: 'es', label: 'Español' },
        { value: 'ar', label: 'عربى' }
      ],
      countries: countryOptions
    }
  },
  methods: {
    onLanguage(newLocale) {
      this.registration.language = newLocale
      setLocale(newLocale)
    },
    async submit() {
      if (this.checkForErrors(this.registration)) {
        return
      }

      const passed = await this.$store.dispatch(
        'api/register',
        this.registration
      )

      if (passed) {
        this.$gtag.event('register', {
          event_category: 'users',
          event_label: 'User registered',
          value: 0
        })
      }

      this.done = passed
    },
    checkForErrors({ name, email, language, country, affiliation }) {
      Object.keys(this.errors).forEach(key => (this.errors[key] = false))

      if (!name) {
        this.errors.name = true
      }

      if (!email || !isEmail(email)) {
        this.errors.email = true
      }

      if (!language || !['en', 'fr', 'es', 'ar'].includes(language)) {
        this.errors.language = true
      }

      if (!country) {
        this.errors.country = true
      }

      if (!affiliation) {
        this.errors.affiliation = true
      }

      return Object.keys(this.errors).some(key => this.errors[key])
    }
  }
}
</script>

<style lang="scss" scoped>
.content ul {
  margin-top: 0;
}
</style>
