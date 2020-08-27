import { sharedSocket } from '../../plugins/sockets'

const state = () => ({
  sessionId: null,
  channel: null,
  isLive: false,
  liveStarted: null,
  messages: [],
  users: [],
  activeUser: null,
  request: null
})

const getters = {}

const mutations = {
  join(state, { sessionId, channel }) {
    state.sessionId = sessionId
    state.channel = channel
  },
  leave(state) {
    state.sessionId = null
    state.channel = null
    state.isLive = false
    state.liveStarted = null
    state.messages = []
    state.users = []
    state.activeUser = null
    state.request = null
  },
  startLive(state) {
    state.isLive = true
    state.liveStarted = new Date()
  },
  stopLive(state) {
    state.isLive = false
    state.liveStarted = null
  },
  message(state, { message, user }) {
    state.messages.push({ date: new Date(), message, user })
  },
  userJoined(state, user) {
    state.users = state.users.filter(u => u.slug !== user.slug)
    state.users.push(user)
  },
  userLeft(state, user) {
    state.users = state.users.filter(u => u.slug !== user.slug)
  },
  activeUser(state, user = null) {
    state.activeUser = user
    state.request = null
  },
  startRequest(state, { user, duration }) {
    state.request = { user, duration, status: 'pending', nextUser: null }
  },
  updateRequest(state, { status, newUser = null }) {
    if (!state.request) {
      console.error('Cannot update status with no request')
      return
    }
    state.request.status = status
    state.request.nextUser = newUser
  }
}

function activeOrFail(state) {
  if (!state.sessionId || !state.channel) {
    throw new Error('Not in a session')
  }
  return [state.sessionId, state.channel]
}

function isCurrentUser(rootState, user) {
  return rootState.api.user?.sub === user.email
}

const actions = {
  sendData(context, arrayBuffer) {
    sharedSocket.emitBinary('send-interpret', arrayBuffer)
  },
  join(context, { sessionId, channel }) {
    sharedSocket.emit('join-interpret', sessionId, channel)
    context.commit('join', { sessionId, channel })
  },
  message({ state }, message) {
    const [sessionId, channel] = activeOrFail(state)

    sharedSocket.emit('message-interpret', sessionId, channel, message)
  },
  leave({ state, commit }) {
    const [sessionId, channel] = activeOrFail(state)

    sharedSocket.emit('leave-interpret', sessionId, channel)
    commit('leave')
  },
  startLive({ state, commit }) {
    const [sessionId, channel] = activeOrFail(state)

    sharedSocket.emit('start-interpret', sessionId, channel)

    commit('startLive')
  },
  stopLive({ state, rootState, commit }) {
    const [sessionId, channel] = activeOrFail(state)

    sharedSocket.emit('stop-interpret', sessionId, channel)

    commit('stopLive')

    if (isCurrentUser(rootState, state.activeUser)) {
      commit('activeUser', null)
    }
  },
  request({ state }) {
    const [sessionId, channel] = activeOrFail(state)

    sharedSocket.emit('request-interpret', sessionId, channel)
  },
  liveStarted({ rootState, commit }, user) {
    // If a user has taken over, reset local live state
    if (isCurrentUser(rootState, user) === false) {
      commit('stopLive')
    }

    commit('activeUser', user)
  },
  respondToRequest({ commit, state }, status) {
    const [sessionId, channel] = activeOrFail(state)

    if (!['accept', 'reject'].includes(status)) {
      throw new Error('Bad request status')
    }

    if (status === 'accept') {
      sharedSocket.emit('accept-interpret', sessionId, channel)
    }

    if (status === 'reject') {
      commit('updateRequest', { status })
    }
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
