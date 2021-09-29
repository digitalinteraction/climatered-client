<template>
  <IfrcUtilLayout width="large">
    <div class="interpreterSchedule">
      <h1 class="title">
        {{ $t('ifrc.interpretSchedule.title') }}
      </h1>
      <p class="subtitle">
        {{ $t('ifrc.interpretSchedule.subtitle') }}
      </p>
      <div class="notification is-warning">
        <strong>
          {{ $t('ifrc.interpretSchedule.chromeWarning') }}
        </strong>
      </div>

      <!--
        Error if unsupported
      -->
      <div class="notification is-danger" v-if="!isSupported">
        <h1 class="title is-4">
          {{ $t('ifrc.interpretSchedule.unsupportedTitle') }}
        </h1>
        <p class="subtitle">
          {{ $t('ifrc.interpretSchedule.unsupportedInfo') }}
        </p>
      </div>

      <!--
        Schedule if supported
      -->
      <table class="table is-fullwidth" v-else>
        <thead>
          <tr>
            <th>{{ $t('ifrc.interpretSchedule.session') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.sessionTitle') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.date') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.start') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.end') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.language') }}</th>
            <th>{{ $t('ifrc.interpretSchedule.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in interpretedSessions" :key="group.session.id">
            <td>{{ group.session.id }}</td>
            <td class="title-cell">{{ getTitle(group.session) }}</td>
            <td>{{ getLocaleDate(group.slot.start) }}</td>
            <td>{{ getLocaleTime(group.slot.start) }}</td>
            <td>{{ getLocaleDate(group.slot.end) }}</td>
            <td class="floor-cell">{{ getFloorLanguage(group.session) }}</td>
            <td>
              <div class="buttons">
                <router-link
                  v-for="lang in getLanguages(group.session)"
                  class="button is-link"
                  :key="lang"
                  :to="getBoothRoute(group.session, lang)"
                >
                  {{ lang }}
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import {
  AudioBroadcaster,
  localiseFromObject,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { Session, SessionSlot } from '@openlab/deconf-shared'

interface SessionAndSlot {
  session: Session
  slot: SessionSlot
}

interface Data {
  isSupported: boolean
}

export default Vue.extend({
  components: { IfrcUtilLayout },
  data(): Data {
    return {
      isSupported: AudioBroadcaster.isSupported(),
    }
  },
  computed: {
    ...mapApiState('api', ['schedule']),
    interpretedSessions(): SessionAndSlot[] {
      if (!this.schedule) return []

      const sessions = this.schedule.sessions.filter(
        (s) =>
          Boolean(s.slot) &&
          s.enableInterpretation &&
          s.hostLanguages.length > 1
      )

      const slots = new Map(this.schedule.slots.map((s) => [s.id, s]))

      const grouped = sessions
        .map((s) => ({
          slot: slots.get(s.slot as string) as SessionSlot,
          session: s,
        }))
        .filter((g) => Boolean(g.slot))

      grouped.sort((a, b) => a.slot.start.getTime() - b.slot.start.getTime())

      return grouped
    },
  },
  methods: {
    getLocaleDate(date: Date) {
      return date.toLocaleDateString()
    },
    getLocaleTime(date: Date) {
      return date.toLocaleTimeString()
    },
    getLanguages(session: Session) {
      return session.hostLanguages.slice(1).sort((a, b) => a.localeCompare(b))
    },
    getTitle(session: Session) {
      return localiseFromObject(this.$i18n.locale, session.title)
    },
    getFloorLanguage(session: Session) {
      return session.hostLanguages[0]
    },
    getBoothRoute(session: Session, channel: string) {
      return {
        name: Routes.InterpretSession,
        params: { sessionId: session.id, channel },
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.interpreterSchedule {
  .button {
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
}
</style>
