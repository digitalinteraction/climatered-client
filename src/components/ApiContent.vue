<template>
  <div class="content" v-html="htmlContent" />
</template>

<script lang="ts">
import Vue from 'vue'
import { delocalise, LocalisedContent } from '@/lib/module'

interface Data {
  content: LocalisedContent | undefined
}

export default Vue.extend({
  props: {
    slug: { type: String, required: true },
  },
  data(): Data {
    return {
      content: undefined,
    }
  },
  computed: {
    htmlContent(): string | undefined {
      if (!this.content) return undefined
      return delocalise(this.content, this.$i18n.locale)
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.content = await this.$store.dispatch('api/fetchContent', this.slug)
    },
  },
})
</script>
