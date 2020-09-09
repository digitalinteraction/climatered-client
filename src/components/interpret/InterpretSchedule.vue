<template>
  <div class="interpret-schedule">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th v-t="'interpretSchedule.heading.session'" />
          <th v-t="'interpretSchedule.heading.title'" />
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
          <td class="title-cell">{{ group.session.title.en }}</td>
          <td>{{ group.slot.id }}</td>
          <td>{{ group.slot.start | localeDate }}</td>
          <td>{{ group.slot.start | localeTime }}</td>
          <td>{{ group.slot.end | localeTime }}</td>
          <td class="floor-cell">{{ group.session.hostLanguage[0] }}</td>
          <td>
            <div class="buttons">
              <router-link
                v-for="lang in interpretLangs(group.session.hostLanguage)"
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
      const grouped = this.interpretedSessions.map(session => ({
        slot: this.slots.find(s => s.id === session.slot),
        session
      }))

      grouped.sort((a, b) => a.slot.start.localeCompare(b.slot.start))

      return grouped
    }
  },
  methods: {
    interpretRoute(session, language) {
      return {
        name: ROUTE_INTERPRET,
        params: { sessionSlug: session.slug, channel: language }
      }
    },
    interpretLangs(langs) {
      return langs.slice(1).sort((a, b) => a.localeCompare(b))
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons .button {
  text-transform: uppercase;
}

.title-cell {
  max-width: 300px;
}

.floor-cell {
  text-transform: uppercase;
  font-weight: bold;
  font-size: $size-5;
}
</style>
