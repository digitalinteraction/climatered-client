import Vue from 'vue'

import App from './App.vue'
import router from './router/module'
// import store from './store/module'
// import i18n from './i18n/module'

import { lib } from '@openlab/deconf-ui-toolkit'

// import FontawesomePlugin from './plugins/fontawesome-plugin'
// import EnvPlugin from './plugins/env-plugin'
// import DevPlugin from './plugins/dev-plugin'
// import AnalyticsPlugin from './plugins/analytics-plugin'
// import SocketIoPlugin from './plugins/socketio-plugin'
// import TemporalPlugin from './plugins/temporal-plugin'

Vue.use(lib.TemporalPlugin)
Vue.use(lib.DevPlugin)

Vue.config.productionTip = false

new Vue({
  // i18n,
  router,
  // store,
  render: (h) => h(App),
}).$mount('#app')
