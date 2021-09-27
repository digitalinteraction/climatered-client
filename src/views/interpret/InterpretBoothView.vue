<template>
  <IfrcUtilLayout width="large" v-if="session && self">
    <BackButton :to="scheduleRoute" slot="backButton">
      {{ $t('ifrc.interpretBooth.backButton') }}
    </BackButton>
    <div slot="default" class="interpreterBooth">
      <h1 class="title">
        {{ $t('ifrc.interpretBooth.title') }}
      </h1>
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>{{ $t('ifrc.interpretBooth.sessionLabel') }}</th>
            <th>{{ $t('ifrc.interpretBooth.floorLabel') }}</th>
            <th>{{ $t('ifrc.interpretBooth.outputLabel') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ localeTitle }}</td>
            <td class="is-uppercase">{{ floorLanguage }}</td>
            <td class="is-uppercase">{{ channel }}</td>
          </tr>
        </tbody>
      </table>
      <div class="columns">
        <div class="column is-three-fifths">
          <InterpretControls :booth="booth" />

          <!-- TODO: <ApiContent slug="interpret" /> -->
        </div>
        <div class="column">
          <InterpretPanel
            :messages="messages"
            :interpreters="interpreters"
            @message="onMessage"
          />
        </div>
      </div>
      <!--
        Debug
       -->
      <details>
        <summary>debug</summary>
        <pre v-html="$store.state.interpret"></pre>
      </details>
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import InterpretPanel from '@/components/InterpretPanel.vue'
import InterpretControls from '@/components/InterpretControls.vue'
import {
  BackButton,
  localiseFromObject,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { InterpretBooth, Interpreter, Session } from '@openlab/deconf-shared'
import { mapInterpretState } from '@/store/interpret-module'

export default Vue.extend({
  components: { IfrcUtilLayout, BackButton, InterpretPanel, InterpretControls },
  props: {
    sessionId: { type: String, required: true },
    channel: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule']),
    ...mapInterpretState('interpret', [
      'messages',
      'interpreters',
      'self',
      'activeBooth',
    ]),
    scheduleRoute() {
      return { name: Routes.InterpretHome }
    },
    session(): Session {
      // Component is wrapped with v-if to assert this
      return this.schedule?.sessions.find(
        (s) => s.id === this.sessionId
      ) as Session
    },
    localeTitle(): string {
      return (
        localiseFromObject(this.$i18n.locale, this.session.title) ??
        this.sessionId
      )
    },
    floorLanguage(): string {
      return this.session.hostLanguages[0]
    },
    booth(): InterpretBooth {
      return {
        sessionId: this.sessionId,
        channel: this.channel,
      }
    },
  },
  created() {
    this.$io.socket.on('interpreter-self', this.onInterpretSelf)
    this.$io.socket.on('interpreter-joined', this.onInterpretJoined)
    this.$io.socket.on('interpreter-started', this.onInterpretStarted)
    this.$io.socket.on('interpreter-message', this.onInterpretMessage)
    this.$io.socket.on('interpreter-left', this.onInterpretLeft)
    this.$io.socket.on('interpreter-stopped', this.onInterpretStopped)
    this.$io.socket.on('interpreter-requested', this.onInterpretRequested)
    this.$io.socket.on('interpreter-accepted', this.onInterpretAccepted)
    this.$io.socket.on('interpreter-takeover', this.onInterpreterTakeover)
  },
  mounted() {
    this.$store.dispatch('interpret/joinBooth', this.booth)
    // this.$io.socket.emit('joinBooth', this.booth)
    // this.$store.commit('interpret/join', this.booth)
  },
  beforeRouteLeave(to, from, next) {
    if (!this.activeBooth) return next()

    let confirmed = window.confirm(
      this.$t('ifrc.interpretBooth.confirmLeave') as string
    )
    if (confirmed) next()
  },
  destroyed() {
    this.$io.socket.off('interpreter-self', this.onInterpretSelf)
    this.$io.socket.off('interpreter-joined', this.onInterpretJoined)
    this.$io.socket.off('interpreter-started', this.onInterpretStarted)
    this.$io.socket.off('interpreter-message', this.onInterpretMessage)
    this.$io.socket.off('interpreter-left', this.onInterpretLeft)
    this.$io.socket.off('interpreter-stopped', this.onInterpretStopped)
    this.$io.socket.off('interpreter-requested', this.onInterpretRequested)
    this.$io.socket.off('interpreter-accepted', this.onInterpretAccepted)
    this.$io.socket.on('interpreter-takeover', this.onInterpreterTakeover)

    // this.$io.socket.emit('leaveBooth', this.booth)
    // this.$store.commit('interpret/leave')
    this.$store.dispatch('interpret/leaveBooth', this.booth)
  },
  methods: {
    onInterpretSelf(user: Interpreter) {
      console.debug('onInterpretSelf', user)

      // TODO: update when fix is published
      this.$store.commit('interpret/self', user)
    },
    onInterpretJoined(user: Interpreter) {
      console.debug('interpretJoined', user)

      this.$store.commit('interpret/interpreterJoined', user)
      this.$store.commit('interpret/messageBooth', {
        user,
        message: 'joined the booth',
      })
    },
    onInterpretLeft(user: Interpreter) {
      console.debug('onInterpretLeft', user)

      this.$store.commit('interpret/interpreterLeft', user)
      this.$store.commit('interpret/messageBooth', {
        user,
        message: 'left the booth',
      })
    },
    onInterpretStarted(user: Interpreter) {
      console.debug('onInterpretStarted', user)

      this.$store.commit('interpret/startInterpret', user)
      this.$store.commit('interpret/messageBooth', { user, message: 'started' })
    },
    onInterpretMessage(user: Interpreter, message: string) {
      console.debug('onInterpretMessage', user, message)

      this.$store.commit('interpret/messageBooth', { user, message })
    },
    onInterpretStopped(user: Interpreter) {
      console.debug('onInterpretStopped', user)

      this.$store.commit('interpret/stopInterpret')
    },
    onInterpretRequested(user: Interpreter, duration: number) {
      console.debug('onInterpretRequested', user, duration)

      // this.$store.commit('interpret/startRequest', { user, duration })
    },
    onInterpretAccepted(user: Interpreter) {
      console.debug('onInterpretAccepted', user)

      // const status = 'accept'
      // this.$store.commit('interpret/updateRequest', { status, newUser })
    },
    onInterpreterTakeover(user: Interpreter) {
      console.debug('onInterpreterTakeover', user)

      // const status = 'accept'
      // this.$store.commit('interpret/updateRequest', { status, newUser })
    },

    onMessage(message: string) {
      // this.$io.socket.emit('messageBooth', this.booth, message)
      this.$store.dispatch('interpret/messageBooth', message)
    },
  },
})
</script>

<style lang="scss">
.interpreterBooth {
  .table {
    margin-bottom: 5rem;
  }
}
</style>
