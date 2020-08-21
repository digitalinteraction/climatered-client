import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueGtag from 'vue-gtag'
import ICS from 'vue-ics'

import { STORAGE_ANALYTICS } from '@/const'

import Clock from './plugins/clock'
import Sockets from './plugins/sockets'
import Content from './plugins/content'

Vue.config.productionTip = false

Vue.filter('localeDate', v => new Date(v).toLocaleDateString())
Vue.filter('localeTime', v => new Date(v).toLocaleTimeString())
Vue.filter('localeDateTime', v => {
  const d = new Date(v)
  return d.toLocaleTimeString() + ' ' + d.toLocaleDateString()
})

Vue.use(Clock)
Vue.use(Sockets)
Vue.use(Content)
Vue.use(ICS)

Vue.use(
  VueGtag,
  {
    config: {
      id: 'UA-85374573-23',
      params: {
        anonymize_ip: true,
        allow_ad_personalization_signals: false,
        allow_google_signals: false
      }
    },
    enabled:
      process.env.NODE_ENV === 'production' &&
      localStorage[STORAGE_ANALYTICS] === 'accept'
  },
  router
)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
