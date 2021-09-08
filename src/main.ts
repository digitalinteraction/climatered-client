import Vue from 'vue'

import App from './App.vue'
import router from './router/module'
import store from './store/module'
import i18n from './i18n/module'

import { DevPlugin, TemporalPlugin } from '@openlab/deconf-ui-toolkit'

import { EnvPlugin } from './plugins/env-plugin'
import { FontAwesomePlugin } from './plugins/fontawesome-plugin'
import { MetricsPlugin } from './plugins/metrics-plugin'
import { SocketIoPlugin } from './plugins/socketio-plugin'

Vue.use(TemporalPlugin)
Vue.use(DevPlugin)
Vue.use(EnvPlugin)
Vue.use(FontAwesomePlugin)
Vue.use(MetricsPlugin)
Vue.use(SocketIoPlugin)

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
