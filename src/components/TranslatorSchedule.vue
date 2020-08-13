<template>
  <div class="translator-schedule">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Slot</th>
          <th>Host language</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in eventsWithSlots" :key="group.event.id">
          <td>{{ group.slot.start | localeDate }}</td>
          <td>{{ group.slot.start | localeTime }}</td>
          <td>{{ group.slot.end | localeTime }}</td>
          <td>{{ group.slot.id }}</td>
          <td>{{ group.event.hostLanguage }}</td>
          <td>
            <router-link :to="group.event | eventRoute">
              {{ group.event.id }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    slots: { type: Array, required: true },
    events: { type: Array, required: true }
  },
  filters: {
    eventRoute: e => ({ name: 'Translator', params: { eventId: e.id } })
  },
  computed: {
    eventsWithSlots() {
      return this.events.map(event => ({
        slot: this.slots.find(s => s.id === event.slot),
        event
      }))
    }
  },
  methods: {
    // eventSlot(event) {
    //   return this.slots.find(s => s.id === event.slot)
    // }
  }
}
</script>
