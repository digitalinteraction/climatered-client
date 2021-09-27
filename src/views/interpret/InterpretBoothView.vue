<template>
  <IfrcUtilLayout width="large" v-if="session">
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
    </div>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import {
  BackButton,
  localiseFromObject,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { Session } from '@openlab/deconf-shared'

export default Vue.extend({
  components: { IfrcUtilLayout, BackButton },
  props: {
    sessionId: { type: String, required: true },
    channel: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule']),
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
  },
})
</script>
