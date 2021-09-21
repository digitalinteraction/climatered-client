<template>
  <BrandedAppLayout>
    <div class="helpdesk" ref="root"></div>
  </BrandedAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import BrandedAppLayout from '@/components/BrandedAppLayout.vue'

const SCRIPT_SRC = 'https://static.landbot.io/landbot-3/landbot-3.0.0.js'

const CHAT_SOURCES = {
  en: 'https://chats.landbot.io/v3/H-696982-BAZDZ3L80F9LBJS0/index.json',
  fr: 'https://chats.landbot.io/v3/H-700110-7X6TH2ZJ8EZAB2X4/index.json',
  es: 'https://chats.landbot.io/v3/H-700112-RPM4983E6BWMSCLH/index.json',
  ar: 'https://chats.landbot.io/v3/H-700114-DUJHTAN0MSA0GMLE/index.json',
}

type Locale = 'en' | 'fr' | 'es' | 'ar'
interface LandbotContainer {
  destroy(): void
}
interface LandbotWindow {
  Landbot?: {
    Container: {
      new (options: unknown): LandbotContainer
    }
  }
}

interface Data {
  frameInstace: LandbotContainer | null
}

const landbotWindow = window as LandbotWindow

export default Vue.extend({
  components: { BrandedAppLayout },
  data(): Data {
    return {
      frameInstace: null,
    }
  },
  computed: {
    landbotSource(): string {
      return CHAT_SOURCES[this.$i18n.locale as Locale]
    },
  },
  watch: {
    landbotSource(newValue) {
      this.setBotSource(newValue)
    },
  },
  mounted() {
    this.setup()
  },
  methods: {
    async setup() {
      await this.checkForScript()
      this.setBotSource(this.landbotSource)
    },
    async checkForScript() {
      // Do nothing if already loaded
      if (landbotWindow.Landbot) return

      // Create the script tag
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('SameSite', 'None; Secure')
      script.setAttribute('async', 'true')
      script.setAttribute('src', SCRIPT_SRC)

      // Append the script to the DOM
      document.body.appendChild(script)

      // Wait for it to be loaded
      return new Promise((resolve) => {
        script.addEventListener('load', () => {
          resolve(script)
        })
      })
    },
    setBotSource(source: string) {
      const rootRef = this.$refs.root as Element
      if (!this.$refs.root || !landbotWindow.Landbot) return

      // If there is already a frame, destroy it
      if (this.frameInstace) this.frameInstace.destroy()

      // Create a frame for the bot to go in (destroy will remove it)
      const div = document.createElement('div')
      div.setAttribute('id', 'landbotFrame')
      rootRef.appendChild(div)

      // Create and store the frame
      this.frameInstace = new landbotWindow.Landbot.Container({
        container: '#landbotFrame',
        configUrl: source,
      })
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
#landbotFrame {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
