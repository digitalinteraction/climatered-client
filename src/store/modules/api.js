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
  user: null,
  siteVisitors: 0,
  profile: null,
  carbon: null
})

const agent = axios.create({
  baseURL: pickApi(),
  validateStatus: code => code < 500
})

const getters = {
  track: state => slug => state.tracks.find(s => s.slug === slug),
  type: state => slug => state.types.find(s => s.slug === slug),
  session: state => slug => state.sessions.find(s => s.slug === slug),
  slot: state => slug => state.slots.find(s => s.slug === slug),

  featuredSessions: state => {
    let featuredSessions = JSON.parse(JSON.stringify(state.sessions))

    // Filter out non-featured sessions
    featuredSessions = featuredSessions.filter(s => {
      return s.isFeatured || process.env.NODE_ENV === 'development'
    })

    // Populate slot value
    featuredSessions.forEach(s => {
      s.slot = state.slots.find(s2 => s2.slug === s.slot)
    })

    // Filter sessions with hideFromSchedule
    featuredSessions = featuredSessions.filter(s => {
      return !s.hideFromSchedule
    })

    // Filter out old sessions
    featuredSessions = featuredSessions.filter(s => {
      if (!s.slot) return false
      return new Date(s.slot.start).getTime() > Date.now()
    })

    // Sort by slot time
    featuredSessions = featuredSessions.sort((a, b) => {
      return new Date(a.slot.start) - new Date(b.slot.start)
    })

    let skip = 0
    const limit = 3

    if (process.env.NODE_ENV === 'development') {
      skip = 0
    }

    // Return sessions
    return featuredSessions.splice(skip, limit)
  }
}

const mutations = {
  slots: (state, slots) => Object.assign(state, { slots }),
  sessions: (state, sessions) => Object.assign(state, { sessions }),
  settings: (state, settings) => Object.assign(state, { settings }),
  apiState: (state, apiState) => Object.assign(state, { apiState }),
  user: (state, user) => Object.assign(state, { user }),
  profile: (state, profile) => Object.assign(state, { profile }),

  speakers: (state, speakers) => Object.assign(state, { speakers }),
  themes: (state, themes) => Object.assign(state, { themes }),
  tracks: (state, tracks) => Object.assign(state, { tracks }),
  types: (state, types) => Object.assign(state, { types }),

  updateAttendance: (state, payload) => {
    const session = state.sessions.find(
      session => session.slug === payload.sessionSlug
    )
    Object.assign(session, {
      attendance: parseInt(session.attendance) + parseInt(payload.change)
    })
  },

  updateCarbonData: (state, carbon) => {
    Object.assign(state, { carbon })
  },

  siteVisitors: (state, siteVisitors) => Object.assign(state, { siteVisitors })
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

    dispatch('getProfile')

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
  async fetchSessions({ commit }) {
    const response = await agent.get('/schedule/sessions')

    if (response.status >= 400) return

    commit('sessions', response.data.sessions)
  },
  async login(ctx, email) {
    const response = await agent.get('/login/email', {
      params: { email, n: Date.now() },
      headers: { 'cache-control': 'no-cache' }
    })

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
  },
  async getProfile({ commit }) {
    const response = await agent.get('/me')
    if (response.status !== 200) return null
    commit('profile', response.data.user)
  },
  async unregister() {
    const response = await agent.delete('/me')
    if (response.status !== 200) return false
    return true
  },
  async registerAttendence(ctx, { sessionSlug }) {
    const response = await agent.post(`/attend/${sessionSlug}`, {
      headers: {
        'content-type': 'application/json'
      }
    })

    if (response.status === 200) {
      ctx.commit('updateAttendance', { change: 1, sessionSlug })
    }

    return response.status === 200
  },
  async unregisterAttendence(ctx, { sessionSlug }) {
    const response = await agent.post(`/unattend/${sessionSlug}`, {
      headers: {
        'content-type': 'application/json'
      }
    })

    if (response.status === 200) {
      ctx.commit('updateAttendance', { change: -1, sessionSlug })
    }

    return response.status === 200
  },
  async checkAttendence(ctx, { sessionSlug }) {
    const response = await agent.get(`/attendance/${sessionSlug}`, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      params: {
        n: Date.now()
      }
    })
    return response
  },
  async fetchCarbonData(ctx) {
    const response = await agent.get('/carbon', {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      params: {
        n: Date.now()
      }
    })

    if (response.status === 200) {
      ctx.commit('updateCarbonData', response.data)
    }
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
