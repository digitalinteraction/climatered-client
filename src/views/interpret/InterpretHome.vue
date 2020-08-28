<template>
  <InterpretWrapper>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title" v-t="'interpretHome.title'" />
          <p class="subtitle" v-t="'interpretHome.subtitle'" />
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <InterpretSchedule
          :slots="$store.state.api.slots"
          :sessions="$store.state.api.sessions"
        />
      </div>
    </section>
  </InterpretWrapper>
</template>

<script>
import InterpretWrapper from '@/components/interpret/InterpretWrapper.vue'
import InterpretSchedule from '@/components/interpret/InterpretSchedule.vue'

export default {
  components: { InterpretWrapper, InterpretSchedule }
}
</script>
