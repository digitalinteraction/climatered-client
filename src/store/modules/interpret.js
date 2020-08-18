import { sharedSocket } from '../../plugins/sockets'

const state = () => ({
  isLive: false,
  liveStarted: null
})

const getters = {}

const mutations = {
  goLive(state) {
    state.isLive = true
    state.liveStarted = new Date()
  },
  disconnect(state) {
    state.isLive = false
    state.liveStarted = null
  }
}

const actions = {
  // ready({ commit }, isReady) {
  //   // ...
  // },
  async goLive({ commit }, { sessionId, channel }) {
    const accepted = await sharedSocket.emitAndWait(
      'start-channel',
      sessionId,
      channel
    )
    if (accepted === false) return

    commit('goLive')
  },
  disconnect({ commit }) {
    sharedSocket.emit('stop-channel')

    commit('disconnect')
  },
  sendData(context, arrayBuffer) {
    sharedSocket.emitBinary('send-to-channel', arrayBuffer)
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
