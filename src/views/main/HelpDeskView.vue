<template>
  <IfrcAppLayout>
    <div class="helpdesk">
      <iframe
        class="helpdesk-frame"
        :src="landbotSource"
        frameborder="0"
      ></iframe>
    </div>
  </IfrcAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcAppLayout from '@/components/IfrcAppLayout.vue'

const CHAT_SOURCES = {
  en: 'https://chats.landbot.io/v3/H-696982-BAZDZ3L80F9LBJS0/index.html',
  fr: 'https://chats.landbot.io/v3/H-700110-7X6TH2ZJ8EZAB2X4/index.html',
  es: 'https://chats.landbot.io/v3/H-700112-RPM4983E6BWMSCLH/index.html',
  ar: 'https://chats.landbot.io/v3/H-700114-DUJHTAN0MSA0GMLE/index.html',
}

type Locale = 'en' | 'fr' | 'es' | 'ar'

export default Vue.extend({
  components: { IfrcAppLayout },
  computed: {
    landbotSource(): string {
      return CHAT_SOURCES[this.$i18n.locale as Locale]
    },
  },
})
</script>

<style lang="scss">
.helpdesk {
  flex: 1;
  background: $background;
  position: relative;
}
.helpdesk-frame {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
