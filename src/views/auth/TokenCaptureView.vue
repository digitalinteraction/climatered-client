<template>
  <div class="content">
    <p>Working...</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { lib } from '@openlab/deconf-ui-toolkit'
import { TOKEN_STORAGE_KEY } from '@/lib/module'

export default Vue.extend({
  mounted() {
    this.processHash(window.location.hash)
  },
  methods: {
    async processHash(hash: string): Promise<void> {
      if (!hash || !hash.startsWith('#')) return

      const params = new URLSearchParams(hash.slice(1))
      const authToken = params.get(TOKEN_STORAGE_KEY)
      if (!authToken) return

      localStorage.setItem(TOKEN_STORAGE_KEY, authToken)
      await this.$store.dispatch('api/authenticate', authToken)

      this.$router.replace({
        name: lib.Routes.Atrium,
      })
    },
  },
})
</script>
