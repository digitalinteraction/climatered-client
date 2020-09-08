const state = () => ({
  type: null,
  data: null,
  visible: null
})

const getters = {
  modalType: state => state.type,
  modalData: state => state.data,
  modalVisible: state => state.visible
}

const mutations = {
  setModalType: (state, type) => Object.assign(state, { type }),
  setModalData: (state, data) => Object.assign(state, { data }),
  setModalVisible: (state, visible) => Object.assign(state, { visible })
}

const actions = {
  async showModal(ctx, { type, data }) {
    ctx.commit('setModalType', type)
    ctx.commit('setModalData', data)
    ctx.commit('setModalVisible', true)
  },
  async closeModal(ctx) {
    ctx.commit('setModalType', null)
    ctx.commit('setModalData', null)
    ctx.commit('setModalVisible', false)
  }
}

const namespaced = true

export default { namespaced, state, mutations, actions, getters }
