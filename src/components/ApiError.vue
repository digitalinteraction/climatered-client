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
import UtilWrapper from '@/components/UtilWrapper.vue'
import { formatMilliseconds } from 'format-ms'

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
      return formatMilliseconds(timeInMs, { ignore: ['millisecond'] })
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
