import ky from 'ky'

const state = () => ({
  slots: null,
  events: null,
  hasData: false,
  user: null
})

export function pickApi() {
  return window.CONFIG?.API_URL ?? 'http://localhost:3000'
}

const getters = {
  agent: () => {
    const headers = {}

    const { token } = localStorage
    if (localStorage.token) headers.authorization = `Bearer ${token}`

    return ky.extend({
      prefixUrl: pickApi(),
      throwHttpErrors: false,
      headers
    })
  }
}

const mutations = {
  slots: (state, slots) => {
    state.slots = slots
  },
  events: (state, events) => {
    state.events = events
  },
  hasData: (state, hasData) => {
    state.hasData = hasData
  },
  user: (state, user) => {
    state.user = user
  }
}

const actions = {
  async fetchData({ commit, getters }) {
    const agent = getters.agent

    const [slots, events] = await Promise.all([
      agent.get('schedule/slots').json(),
      agent.get('schedule/sessions').json()
    ])

    commit('slots', slots.slots)
    commit('events', events.events)
    commit('hasData', true)
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
