import Vue from 'vue'
import Vuex from 'vuex'

import { apiModule } from './api-module'
import { metricsModule } from './metrics-module'
import { interpretModule } from './interpret-module'

import {
  ApiModuleState,
  InterpretModuleState,
  MetricsModuleState,
} from '@openlab/deconf-ui-toolkit'

Vue.use(Vuex)

export interface StoreState {
  api: ApiModuleState
  metrics: MetricsModuleState
  interpret: InterpretModuleState
}

export default new Vuex.Store({
  modules: {
    api: apiModule(),
    interpret: interpretModule(),
    metrics: metricsModule(),
  },
})
