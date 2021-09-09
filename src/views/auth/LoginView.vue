<template>
  <BrandedUtilLayout>
    <div class="loginView">
      <h1 class="title">{{ $t('ifrc.login.title') }}</h1>
      <div class="content">
        <p>{{ $t('ifrc.login.infoText') }}</p>
      </div>
      <div class="notification is-success" v-if="state === 'success'">
        <button class="delete" @click="state = 'pending'"></button>
        <p>{{ $t('ifrc.login.doneText') }}</p>
      </div>
      <div class="notification is-danger" v-if="state === 'error'">
        <p>{{ $t('ifrc.login.badEmail') }}</p>
      </div>
      <div class="loginView-form" v-if="state !== 'success'">
        <TextField
          name="email"
          type="email"
          :label="$t('ifrc.login.email.label')"
          :placeholder="$t('ifrc.login.email.placeholder')"
          :help="$t('ifrc.login.email.help')"
          :has-error="state === 'error'"
          :disabled="state === 'working'"
          v-model="email"
          @enter="submit"
        />
        <div class="buttons">
          <button
            class="button is-primary"
            @click="submit"
            :disabled="state === 'working'"
          >
            {{ $t('ifrc.login.submitButton') }}
          </button>
        </div>
      </div>
      <hr />
      <div class="content">
        <p>
          {{ $t('ifrc.login.registerLabel') }}
          <router-link :to="registerRoute">
            {{ $t('ifrc.login.registerAction') }}
          </router-link>
        </p>
      </div>
    </div>
  </BrandedUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedUtilLayout from '@/components/BrandedUtilLayout.vue'
import { Routes, TextField } from '@openlab/deconf-ui-toolkit'
import { Location } from 'vue-router'
import { pause } from '@/lib/module'

interface Data {
  email: string
  state: 'pending' | 'working' | 'error' | 'success'
}

export default Vue.extend({
  components: { BrandedUtilLayout, TextField },
  data(): Data {
    return {
      email: '',
      state: 'pending',
    }
  },
  computed: {
    registerRoute(): Location {
      return { name: Routes.Register }
    },
  },
  methods: {
    async submit() {
      this.state = 'working'
      const success = await this.$store.dispatch('api/login', this.email)
      await pause(300)

      this.state = success ? 'success' : 'error'

      // TODO: metrics
    },
  },
})
</script>
