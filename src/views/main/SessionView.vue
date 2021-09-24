<template>
  <IfrcAppLayout v-if="session">
    <SessionView
      v-if="schedule && session"
      api-module="api"
      :session="session"
      :schedule="schedule"
      :logged-in="Boolean(user)"
      :schedule-date="scheduleDate"
    >
      <BackButton slot="backButton" :to="backRoute">
        {{ $t('deconf.session.backButton') }}
      </BackButton>
    </SessionView>
  </IfrcAppLayout>
  <NotFoundView v-else />
</template>

<script lang="ts">
import { Session } from '@openlab/deconf-shared'
import {
  mapApiState,
  SessionView,
  BackButton,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import IfrcAppLayout from '../../components/IfrcAppLayout.vue'
import NotFoundView from '../../views/pages/NotFoundView.vue'
import Vue from 'vue'
import { Location } from 'vue-router'

export default Vue.extend({
  components: { IfrcAppLayout, SessionView, BackButton, NotFoundView },
  props: {
    sessionId: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    session(): Session | null {
      if (!this.schedule) return null
      return this.schedule.sessions.find((s) => s.id === this.sessionId) ?? null
    },
    scheduleDate(): Date {
      return this.$dev.scheduleDate ?? this.$temporal.date
    },
    backRoute(): Location {
      return { name: Routes.Schedule }
    },
  },
})
</script>
