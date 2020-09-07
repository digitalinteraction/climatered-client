<template>
  <InterpretWrapper>
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title" v-t="'interpretHome.title'" />
          <p class="subtitle" v-t="'interpretHome.subtitle'" />
        </div>
      </div>
    </section>
    <section class="section" v-if="canInterpret">
      <div class="container">
        <div class="content">
          <p>{{ $t('interpretHome.welcome', [user.sub]) }}</p>
        </div>
        <div class="notification is-warning is-light">
          <p class="is-size-5">{{ $t('interpretHome.chromeWarning') }}</p>
        </div>
        <InterpretSchedule
          :slots="$store.state.api.slots"
          :sessions="$store.state.api.sessions"
        />
      </div>
    </section>
    <section class="section" v-else>
      <div class="container">
        <article class="message is-danger is-narrow">
          <div class="message-header">
            <p v-t="'interpretHome.unavailableTitle'" />
          </div>
          <div class="message-body" v-t="'interpretHome.unavailableBody'" />
        </article>
        <div class="buttons is-centered">
          <router-link :to="atriumRoute" class="button is-link">
            {{ $t('general.backTo', [$t('atrium.title')]) }}
          </router-link>
        </div>
      </div>
    </section>
  </InterpretWrapper>
</template>

<script>
import { mapState } from 'vuex'
import InterpretWrapper from '@/components/interpret/InterpretWrapper.vue'
import InterpretSchedule from '@/components/interpret/InterpretSchedule.vue'
import { AudioBroadcaster } from '@/audio'
import { ROUTE_ATRIUM } from '@/const'

export default {
  components: { InterpretWrapper, InterpretSchedule },
  data() {
    return {
      canInterpret: AudioBroadcaster.isSupported(),
      atriumRoute: { name: ROUTE_ATRIUM }
    }
  },
  computed: {
    ...mapState('api', ['user'])
  }
}
</script>
