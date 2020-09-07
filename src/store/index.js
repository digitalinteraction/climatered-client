import Vue from 'vue'
import Vuex from 'vuex'

import api from './modules/api'
import interpret from './modules/interpret'
import modals from './modules/modals'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { api, interpret, modals }
})
