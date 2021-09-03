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
import { SocketIoPlugin } from '../plugins/socketio-plugin'
import { lib } from '@openlab/deconf-ui-toolkit'
import { StoreState } from '../store/module'

declare module 'vue/types/vue' {
  // provide typings for `this.$store`
  interface Vue {
    $store: Store<StoreState>
    $env: EnvRecord
    $dev: lib.DevPlugin
    $temporal: lib.TemporalPlugin
    $metrics: MetricsPlugin
    $io: SocketIoPlugin
  }
}
