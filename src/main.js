import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import clock from './clock'
import sockets from './sockets'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.filter('localeDate', v => new Date(v).toLocaleDateString())
Vue.filter('localeTime', v => new Date(v).toLocaleTimeString())

Vue.use(clock)
Vue.use(sockets)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
