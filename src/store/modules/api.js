import ky from 'ky'
import jwt from 'jsonwebtoken'

import { setLocale } from '@/i18n'
import { authenticateSocket } from '../../plugins/sockets.js'

const state = () => ({
  slots: null,
  sessions: null,
  apiState: 'init', // 'init' | 'active' | 'error'
  user: null
})

export function pickApi() {
  return window.CONFIG?.API_URL ?? 'http://localhost:3000'
}

const agent = ky.extend({
  prefixUrl: pickApi(),
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      request => {
        if (!localStorage.token) return
        request.headers.set('Authorization', `Bearer ${localStorage.token}`)
      }
    ]
  }
})

const getters = {
  agent: () => agent
}

const mutations = {
  slots: (state, slots) => {
    state.slots = slots
  },
  sessions: (state, sessions) => {
    state.sessions = sessions
  },
  apiState: (state, apiState) => {
    state.apiState = apiState
  },
  user: (state, user) => {
    state.user = user
  }
}

const actions = {
  async authenticate({ commit, dispatch }, { socket, token }) {
    const user = jwt.decode(token)
    setLocale(user.user_lang)
    authenticateSocket(socket, token)

    commit('user', user)
    return dispatch('fetchData')
  },
  async fetchData({ commit }) {
    try {
      const responses = await Promise.all([
        agent.get('schedule/slots'),
        agent.get('schedule/sessions')
      ])

      for (const response of responses) {
        if (response.status !== 200) throw new Error(response.statusText)
      }

      const [slots, sessions] = await Promise.all(responses.map(r => r.json()))

      commit('slots', slots.slots)
      commit('sessions', sessions.sessions)
      commit('apiState', 'active')
    } catch (error) {
      console.error(error)
      commit('apiState', 'error')
    }
  },
  async register({ getters }, { name, email, language, country, affiliation }) {
    const agent = getters.agent

    const json = { name, email, language, country, affiliation }

    const response = await agent.post('register', { json })

    return response.ok
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
