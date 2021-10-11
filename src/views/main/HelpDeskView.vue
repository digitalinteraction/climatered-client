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
  en: 'https://chats.landbot.io/v3/H-998137-GHQDCSG2U61L6TZ2/index.html',
  fr: 'https://chats.landbot.io/v3/H-1016832-19B4NU1OBO94R2HS/index.html',
  es: 'https://chats.landbot.io/v3/H-1016833-N7UNJMW13WWG9AN2/index.html',
  ar: 'https://chats.landbot.io/v3/H-1016831-UCIRF3TQQ1JK8LQT/index.html',
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
