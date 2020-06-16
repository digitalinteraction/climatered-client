<template>
  <div class="event-page" v-if="hasData">
    <section class="section">
      <div class="container">
        <div class="buttons">
          <router-link class="button is-text" :to="{ name: 'Home' }">
            ← Back to schedule
          </router-link>
          <button class="button is-primary is-light" @click="changeState">
            Stage: {{ slotState }}
          </button>
        </div>
        <h1 class="title">{{ event.name }}</h1>

        <table class="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Start</th>
              <th>End</th>
              <th>Session Id</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ slot.start | localeDate }}</td>
              <td>{{ slot.start | localeTime }}</td>
              <td>{{ slot.end | localeTime }}</td>
              <td>{{ event.id }}</td>
            </tr>
          </tbody>
        </table>

        <h2 class="heading">About</h2>
        <div class="content" v-html="content"></div>

        <component
          v-if="eventComponent"
          :is="eventComponent"
          :event="event"
          :event-slot="slot"
        />
      </div>
    </section>
  </div>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'

// import { slotState } from '../utils.js'
import Countdown from '../components/Countdown.vue'
import OneToMany from '../components/OneToMany.vue'
import ManyToMany from '../components/ManyToMany.vue'

const eventComponents = {
  plenary: OneToMany,
  panel: OneToMany,
  session: ManyToMany
}

export default {
  data() {
    return {
      slotState: 'before'
    }
  },
  mounted() {
    // this.$clock.bind(this, () => {
    //   this.slotState = slotState(this.slot)
    // })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  computed: {
    ...mapState('api', ['hasData', 'events', 'slots']),
    event() {
      return this.events.find(e => e.id === this.$route.params.event)
    },
    slot() {
      return this.event && this.slots.find(s => s.id === this.event.slot)
    },
    content() {
      return this.event && marked(this.event.content)
    },
    eventComponent() {
      if (!this.event || !this.slotState) return null
      if (this.slotState === 'before') return Countdown
      return eventComponents[this.event.type] ?? null
    }
  },
  methods: {
    changeState() {
      const states = ['before', 'active', 'after']
      let i = Math.max(
        0,
        states.findIndex(s => s === this.slotState)
      )
      i = (i + 1) % states.length
      this.slotState = states[i]
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons {
  justify-content: space-between;
}
</style>
