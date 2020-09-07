import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import ICS from 'vue-ics'

import Clock from './plugins/clock'
import Sockets from './plugins/sockets'
import Content from './plugins/content'
import Analytics from './plugins/analytics'

import './plugins/icons'
import './plugins/landbot'

Vue.config.productionTip = false

Vue.filter('localeDate', v => new Date(v).toLocaleDateString())
Vue.filter('localeDateShort', v =>
  new Date(v).toLocaleDateString([], {
    // weekday: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
Vue.filter('localeTime', v => new Date(v).toLocaleTimeString())
Vue.filter('localeTimeShort', v =>
  new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)
Vue.filter('localeDateTime', v => {
  const d = new Date(v)
  return d.toLocaleTimeString() + ' ' + d.toLocaleDateString()
})

Vue.use(Clock)
Vue.use(Sockets)
Vue.use(Content)
Vue.use(Analytics)
Vue.use(ICS)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
