<template>
  <AppWrapper>
    <div class="helpdesk" ref="root"></div>
  </AppWrapper>
</template>

<script>
// refs: https://dev.to/timber/wait-for-a-script-to-load-in-javascript-579k

import AppWrapper from '@/components/AppWrapper.vue'

const scriptSrc = 'https://static.landbot.io/landbot-3/landbot-3.0.0.js'

const sources = {
  en: 'https://chats.landbot.io/v3/H-696982-BAZDZ3L80F9LBJS0/index.json',
  fr: 'https://chats.landbot.io/v3/H-700110-7X6TH2ZJ8EZAB2X4/index.json',
  es: 'https://chats.landbot.io/v3/H-700112-RPM4983E6BWMSCLH/index.json',
  ar: 'https://chats.landbot.io/v3/H-700114-DUJHTAN0MSA0GMLE/index.json'
}

export default {
  components: { AppWrapper },
  data() {
    return {
      frameInstace: null
    }
  },
  computed: {
    landbotSource() {
      return sources[this.$i18n.locale]
    }
  },
  watch: {
    landbotSource(newValue) {
      this.setup(newValue)
    }
  },
  async mounted() {
    await this.checkForScript()
    this.setup(this.landbotSource)
  },
  methods: {
    async checkForScript() {
      // Do nothing if already loaded
      if (window.Landbot) return

      // Create the script tag
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('SameSite', 'None; Secure')
      script.setAttribute('async', true)
      script.setAttribute('src', scriptSrc)

      // Append the script to the DOM
      document.body.appendChild(script)

      // Wait for it to be loaded
      return new Promise(resolve => {
        script.addEventListener('load', () => {
          resolve(script)
        })
      })
    },
    setup(landbotSource) {
      // If there is already a frame, destroy it
      if (this.frameInstace) this.frameInstace.destroy()

      // Create a frame for the bot to go in (destroy will remove it)
      const div = document.createElement('div')
      div.setAttribute('id', 'landbotFrame')
      this.$refs.root.appendChild(div)

      // Create and store the frame
      this.frameInstace = new window.Landbot.Container({
        container: '#landbotFrame',
        configUrl: landbotSource
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.helpdesk {
  @include appPageFlexFillChild;
  background-color: $greyish;
}
</style>

<style lang="scss">
#landbotFrame {
  flex: 1;
}
</style>
