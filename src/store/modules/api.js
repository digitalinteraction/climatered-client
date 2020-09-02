import axios from 'axios'
import jwtDecode from 'jwt-decode'

import { setLocale } from '@/i18n'
import { pickApi } from '@/utils'
import { authenticateSocket } from '../../plugins/sockets.js'

const state = () => ({
  slots: null,
  sessions: null,
  settings: null,
  apiState: 'init', // 'init' | 'active' | 'error'
  user: null
})

const agent = axios.create({
  baseURL: pickApi(),
  validateStatus: code => code < 500
})

const getters = {
  track: state => slug => state.tracks.find(s => s.slug === slug),
  type: state => slug => state.types.find(s => s.slug === slug),
  session: state => id => state.sessions.find(s => s.id === id),
  slot: state => id => state.slots.find(s => s.id === id)
}

const mutations = {
  slots: (state, slots) => Object.assign(state, { slots }),
  sessions: (state, sessions) => Object.assign(state, { sessions }),
  settings: (state, settings) => Object.assign(state, { settings }),
  apiState: (state, apiState) => Object.assign(state, { apiState }),
  user: (state, user) => Object.assign(state, { user }),

  speakers: (state, speakers) => Object.assign(state, { speakers }),
  themes: (state, themes) => Object.assign(state, { themes }),
  tracks: (state, tracks) => Object.assign(state, { tracks }),
  types: (state, types) => Object.assign(state, { types })
}

const actions = {
  async authenticate({ commit, dispatch }, { socket, token }) {
    const user = jwtDecode(token)
    const { chosenLocale = user.user_lang } = localStorage
    setLocale(chosenLocale)
    authenticateSocket(socket, token)

    agent.defaults.headers = {
      ...agent.defaults.headers,
      Authorization: `Bearer ${token}`
    }

    commit('user', user)
    return dispatch('fetchData')
  },
  async fetchData({ commit }) {
    try {
      const responses = await Promise.all([
        agent.get('/schedule/slots'),
        agent.get('/schedule/sessions'),
        agent.get('/schedule/settings'),

        agent.get('/schedule/speakers'),
        agent.get('/schedule/themes'),
        agent.get('/schedule/tracks'),
        agent.get('/schedule/types')
      ])

      for (const response of responses) {
        if (response.status !== 200) throw new Error(response.statusText)
      }

      const [
        slots,
        sessions,
        settings,
        speakers,
        themes,
        tracks,
        types
      ] = responses.map(r => r.data)

      commit('slots', slots.slots)
      commit('sessions', sessions.sessions)
      commit('settings', settings.settings)
      commit('speakers', speakers.speakers)
      commit('themes', themes.themes)
      commit('tracks', tracks.tracks)
      commit('types', types.types)

      commit('apiState', 'active')
    } catch (error) {
      console.error(error)
      commit('apiState', 'error')
    }
  },
  async login(ctx, email) {
    const params = { email }
    const response = await agent.get('/login/email', { params })

    return response.status === 200
  },
  async register(ctx, { name, email, language, country, affiliation }) {
    const data = { name, email, language, country, affiliation }

    const response = await agent.post('/register', data, {
      headers: {
        'content-type': 'application/json'
      }
    })

    return response.status === 200
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
