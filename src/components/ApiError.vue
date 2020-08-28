<template>
  <UtilWrapper>
    <div slot="content" class="api-error">
      <h1 class="title">Something went wrong</h1>
      <p>We're having a bit of trouble, try refresing or coming back later</p>
      <p>Retrying in {{ timeUntil | friendlyTime }}</p>
    </div>
  </UtilWrapper>
</template>

<script>
//
// Displays the api-unavailable error and reloads every minute
//

import UtilWrapper from '@/components/UtilWrapper.vue'
import countdown from 'countdown'

export default {
  components: { UtilWrapper },
  data() {
    const retry = new Date()
    retry.setMinutes(retry.getMinutes() + 1)

    return {
      retry,
      timeUntil: retry.getTime() - Date.now()
    }
  },
  filters: {
    friendlyTime(timeInMs) {
      return countdown(Date.now() + timeInMs).toString()
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.timeUntil = Math.max(0, this.retry.getTime() - Date.now())

      if (this.timeUntil === 0) window.location.reload()
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  }
}
</script>
