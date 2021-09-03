//
// This type file describes vue plugins
//

// import { EnvRecord } from '../plugins/env-plugin'
// import ApiModuleState from '../store/modules/api-module'
import { Store } from 'vuex'
// import DevPlugin from '@/plugins/dev-plugin'
// import TemporalPlugin from '@/plugins/temporal-plugin'

import { EnvRecord } from '../plugins/env-plugin'
import { MetricsPlugin } from '../plugins/metrics-plugin'
import { lib } from '@openlab/deconf-ui-toolkit'

declare module 'vue/types/vue' {
  // declare your own store states
  interface State {
    name: string
  }

  // provide typings for `this.$store`
  interface Vue {
    $store: Store<State>
    $env: EnvRecord
    $dev: lib.DevPlugin
    $temporal: lib.TemporalPlugin
    $metrics: MetricsPlugin
  }
}
