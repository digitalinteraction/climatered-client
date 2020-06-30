import Vue from 'vue'
import { pickApi } from './store/modules/api'
import SocketClient from 'socket.io-client'

export default class Sockets extends Vue {
  static install(Vue) {
    const apiBase = pickApi()

    let pathname = new URL(apiBase).pathname.replace(/\/?$/, '/socket.io')

    const socketUrl = new URL(apiBase)
    socketUrl.protocol = socketUrl.protocol.replace(/^http/, 'ws')
    socketUrl.pathname = '/'

    const socket = new SocketClient(socketUrl.toString(), {
      path: pathname
    })

    socket.on('connect', () => {
      if (localStorage.token) {
        authenticateSocket(socket, localStorage.token)
      }
    })

    socket.on('user-error', ({ message = 'Something went wrong' }) => {
      console.error('socket.io recieved an error', message)
    })

    Vue.prototype.$socket = socket
  }
}

export function authenticateSocket(socket, token) {
  socket.emit('auth', { token: token })
}
