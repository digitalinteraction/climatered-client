<template>
  <div class="attendee-schedule">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Slot</th>
          <th>Events</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in slottedEvents" :key="group.slot.id">
          <td>{{ group.slot.start | localeDate }}</td>
          <td>{{ group.slot.start | localeTime }}</td>
          <td>{{ group.slot.end | localeTime }}</td>
          <td>{{ group.slot.id }}</td>
          <td>
            <p v-if="group.events.length === 0" class="has-text-grey">
              Nothing scheduled yet
            </p>
            <ul v-else>
              <li
                v-for="event in group.events"
                :key="event.id"
                class="event-list"
              >
                <router-link :to="event | eventRoute">
                  {{ event.id }}
                </router-link>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="help has-text-right">
      * dates and times shown are in your computer's timezone
    </p>
  </div>
</template>

<script>
//
// The prototype attendee schedule TBR
//

export default {
  props: {
    slots: { type: Array, required: true },
    events: { type: Array, required: true }
  },
  filters: {
    eventRoute: e => ({ name: 'Event', params: { eventId: e.id } })
  },
  computed: {
    slottedEvents() {
      const grouped = this.slots.map(slot => ({
        slot,
        events: this.events.filter(e => e.slot === slot.id)
      }))

      return grouped.sort((a, b) => a.slot.id.localeCompare(b.slot.id))
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.event-list {
  list-style: disc;
}
</style>
