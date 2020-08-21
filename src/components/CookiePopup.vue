<template>
  <div class="cookies" v-if="!pickedConsent">
    <div class="cookies-box">
      <p class="cookies-title">
        <span v-t="'cookies.popupTitle'" />
        <LanguageControl select-class="is-small" />
      </p>
      <div class="content cookies-content">
        <p>{{ $t('cookies.content', [$t('cookies.title')]) }}</p>
      </div>
      <div class="buttons">
        <button
          class="button is-success is-small is-light"
          @click="accept"
          v-t="'cookies.acceptAction'"
        />
        <button
          class="button is-danger is-small is-light"
          @click="reject"
          v-t="'cookies.rejectAction'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { STORAGE_ANALYTICS } from '@/const'
import LanguageControl from '@/components/LanguageControl.vue'

export const CookieEvents = new Vue()

export default {
  components: { LanguageControl },
  data() {
    return {
      pickedConsent: localStorage[STORAGE_ANALYTICS] !== undefined
    }
  },
  // computed: {
  //   localeContent() {
  //     return content[this.$i18n.locale]
  //   }
  // },
  mounted() {
    CookieEvents.$on('trigger', this.reTrigger)
  },
  destroyed() {
    CookieEvents.$off('trigger', this.reTrigger)
  },
  methods: {
    accept() {
      localStorage[STORAGE_ANALYTICS] = 'accept'
      this.pickedConsent = true

      if (process.env.NODE_ENV !== 'production') {
        this.$gtag.optIn()
        this.$gtag.pageview({
          page_title: this.$route.name,
          page_path: this.$route.path,
          page_location: window.location.href
        })
      }
    },
    reject() {
      localStorage[STORAGE_ANALYTICS] = 'reject'
      this.pickedConsent = true
    },
    reTrigger() {
      this.pickedConsent = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cookies {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 1rem;
  z-index: 50;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  background: rgba(0, 0, 0, 0.2);
}

.cookies-box {
  max-width: 420px;
  margin: auto;
  background: $white;
  padding: 1rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.cookies-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  span {
    font-size: $size-5;
    font-weight: bold;
  }
}

.cookies-content {
  font-size: $size-7;
}

// @supports (backdrop-filter: blur(0)) {
//   .cookies {
//     backdrop-filter: blur(5px);
//   }
// }
</style>
