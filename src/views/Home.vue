<template>
  <div class="home-page">
    <section class="section">
      <div class="container">
        <h1 class="title is-1">Hello!</h1>

        <h2 class="title">Conference schedule</h2>

        <Schedule
          v-if="$store.state.api.hasData"
          :slots="$store.state.api.slots"
          :events="$store.state.api.events"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Schedule from '@/components/Schedule.vue'

export default {
  name: 'Home',
  components: {
    Schedule
  }
}
</script>

<style lang="scss" scoped>
.home-page {
}
</style>
