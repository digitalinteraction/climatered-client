<template>
  <IfrcUtilLayout>
    <div class="content">
      <!--
        Login Error
      -->
      <template v-if="errorCode === 'already_verified'">
        <h1>
          {{ $t('ifrc.serverError.alreadyVerified.title') }}
        </h1>
        <p>
          {{ $t('ifrc.serverError.alreadyVerified.info') }}
        </p>
        <router-link class="button is-link" :to="loginRoute">
          {{ $t('ifrc.serverError.alreadyVerified.logIn') }}
        </router-link>
      </template>

      <!--
        Generic
      -->
      <template v-else>
        <h1>{{ $t('ifrc.serverError.unknown.title') }}</h1>
        <p>{{ $t('ifrc.serverError.unknown.info') }}</p>
        <p>
          <a :href="`mailto:${$t('ifrc.serverError.unknown.email')}`">
            {{ $t('ifrc.serverError.unknown.email') }}
          </a>
        </p>
      </template>
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import { Routes } from '@openlab/deconf-ui-toolkit'
import { Location } from 'vue-router'

export default Vue.extend({
  components: { IfrcUtilLayout },
  props: {
    errorCode: { type: String, default: 'unknown' },
  },
  computed: {
    loginRoute(): Location {
      return { name: Routes.Login }
    },
  },
})
</script>
