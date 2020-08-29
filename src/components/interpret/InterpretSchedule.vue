<template>
  <div class="interpret-schedule">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th v-t="'interpretSchedule.heading.session'" />
          <th v-t="'interpretSchedule.heading.slot'" />
          <th v-t="'interpretSchedule.heading.date'" />
          <th v-t="'interpretSchedule.heading.start'" />
          <th v-t="'interpretSchedule.heading.end'" />
          <th v-t="'interpretSchedule.heading.language'" />
          <th v-t="'interpretSchedule.heading.actions'" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in sessionsWithSlots" :key="group.session.id">
          <td>{{ group.session.id }}</td>
          <td>{{ group.slot.id }}</td>
          <td>{{ group.slot.start | localeDate }}</td>
          <td>{{ group.slot.start | localeTime }}</td>
          <td>{{ group.slot.end | localeTime }}</td>
          <td>{{ group.session.hostLanguage[0] }}</td>
          <td>
            <div class="buttons">
              <router-link
                v-for="lang in group.session.hostLanguage.slice(1)"
                class="button is-link"
                :key="lang"
                :to="interpretRoute(group.session, lang)"
              >
                {{ lang }}
              </router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//
// The interpret schedule table with links to start interpreting
//

import { ROUTE_INTERPRET } from '@/const'

export default {
  props: {
    slots: { type: Array, required: true },
    sessions: { type: Array, required: true }
  },
  // filters: {
  //   eventRoute: e => ({ name: 'Translator', params: { eventId: e.id } })
  // },
  computed: {
    interpretedSessions() {
      return this.sessions.filter(
        session =>
          session.slot &&
          session.enableTranslation &&
          session.hostLanguage.length > 1
      )
    },
    sessionsWithSlots() {
      return this.interpretedSessions.map(session => ({
        slot: this.slots.find(s => s.id === session.slot),
        session
      }))
    }
  },
  methods: {
    interpretRoute(session, language) {
      return {
        name: ROUTE_INTERPRET,
        params: { sessionId: session.id, channel: language }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons .button {
  text-transform: uppercase;
}
</style>
