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
      <ChannelControl
        slot="afterEmbed"
        :channels="channels"
        :sessionId="sessionId"
        v-if="showChannelControl"
      />
      <div class="contactHost" slot="afterContent" v-if="session.contactEmail">
        <p class="contactHost-label">
          {{ $t('ifrc.contactHost.label') }}
        </p>
        <a
          class="button is-primary"
          :href="`mailto:${session.contactEmail}?subject=${session.id}`"
        >
          <span class="icon">
            <fa :icon="['fas', 'envelope']" />
          </span>
          <span> {{ $t('ifrc.contactHost.action') }} </span>
        </a>
      </div>
    </SessionView>
  </IfrcAppLayout>
  <NotFoundView v-else />
</template>

<script lang="ts">
import { Session, SessionSlot } from '@openlab/deconf-shared'
import {
  mapApiState,
  SessionView,
  BackButton,
  Routes,
  getSlotState,
} from '@openlab/deconf-ui-toolkit'
import IfrcAppLayout from '../../components/IfrcAppLayout.vue'
import ChannelControl from '../../components/ChannelControl.vue'
import NotFoundView from '../../views/pages/NotFoundView.vue'
import Vue from 'vue'
import { Location } from 'vue-router'

export default Vue.extend({
  components: {
    IfrcAppLayout,
    ChannelControl,
    SessionView,
    BackButton,
    NotFoundView,
  },
  props: {
    sessionId: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    session(): Session | null {
      if (!this.schedule) return null
      return this.schedule.sessions.find((s) => s.id === this.sessionId) ?? null
    },
    sessionSlot(): SessionSlot | null {
      const { schedule, session } = this
      if (!schedule || !session) return null
      return schedule.slots.find((s) => s.id === session.slot) ?? null
    },
    scheduleDate(): Date {
      return this.$dev.scheduleDate ?? this.$temporal.date
    },
    backRoute(): Location {
      return { name: Routes.Schedule }
    },
    showChannelControl(): boolean {
      if (!this.session || !this.sessionSlot) return false
      if (!this.session.enableInterpretation) return false

      const state = getSlotState(
        this.scheduleDate,
        this.sessionSlot.start,
        this.sessionSlot.end
      )
      return state === 'present' || state === 'past'
    },
    channels(): string[] {
      if (!this.session) return []
      return this.session.hostLanguages.slice(1)
    },
  },
})
</script>

<style lang="scss">
.channelControl {
  margin-bottom: 1rem;
}
.contactHost {
  margin-top: 1rem;
}
.contactHost-label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
</style>
