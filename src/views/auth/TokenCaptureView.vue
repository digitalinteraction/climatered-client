<template>
  <div class="content">
    <p>Working...</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Routes } from '@openlab/deconf-ui-toolkit'
import { StorageKey } from '@/lib/module'

export default Vue.extend({
  mounted() {
    this.processHash(window.location.hash)
  },
  methods: {
    async processHash(hash: string): Promise<void> {
      if (!hash || !hash.startsWith('#')) return

      const params = new URLSearchParams(hash.slice(1))
      const authToken = params.get(StorageKey.AuthToken)
      if (!authToken) return

      localStorage.setItem(StorageKey.AuthToken, authToken)
      await this.$store.dispatch('api/authenticate', authToken)

      this.$router.replace({
        name: Routes.Atrium,
      })
    },
  },
})
</script>
