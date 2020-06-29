import Vue from 'vue'
import { pickApi } from './store/modules/api'
import SocketClient from 'socket.io-client'

export default class Sockets extends Vue {
  static install(Vue) {
    const url = pickApi().replace(/^http/, 'ws')

    const socket = new SocketClient(url)

    socket.on('connect', () => {
      if (!localStorage.token) return

      socket.emit('auth', {
        token: localStorage.token
      })
    })

    socket.on('user-error', ({ message = 'Something went wrong' }) => {
      console.error('socket.io recieved an error', message)
    })

    Vue.prototype.$socket = socket
  }
}
