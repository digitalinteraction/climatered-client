import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

import Clock from './plugins/clock'
import Sockets from './plugins/sockets'
import Content from './plugins/content'

Vue.config.productionTip = false

Vue.filter('localeDate', v => new Date(v).toLocaleDateString())
Vue.filter('localeTime', v => new Date(v).toLocaleTimeString())

Vue.use(Clock)
Vue.use(Sockets)
Vue.use(Content)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
