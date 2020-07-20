import ky from 'ky'

const state = () => ({
  slots: null,
  events: null,
  hasData: false
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
  }
}

const actions = {
  async fetchData({ commit, getters }) {
    const agent = getters.agent

    const [slots, events] = await Promise.all([
      agent.get('schedule/slots').json(),
      agent.get('schedule/events').json()
    ])

    commit('slots', slots.slots)
    commit('events', events.events)
    commit('hasData', true)
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
