import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import clock from './clock'
import sockets from './sockets'

Vue.config.productionTip = false

Vue.filter('localeDate', v => new Date(v).toLocaleDateString())
Vue.filter('localeTime', v => new Date(v).toLocaleTimeString())

Vue.use(clock)
Vue.use(sockets)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
