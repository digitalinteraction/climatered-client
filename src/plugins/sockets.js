import { pickApi } from '../utils'
import { STORAGE_TOKEN } from '../const'
import SocketClient from 'socket.io-client'

export default class ApiSocket {
  listeners = new Map()

  static install(Vue) {
    const apiBase = pickApi()

    const pathname = new URL(apiBase).pathname.replace(/\/?$/, '/socket.io')

    const socketUrl = new URL(apiBase)
    socketUrl.protocol = socketUrl.protocol.replace(/^http/, 'ws')
    socketUrl.pathname = '/'

    Vue.prototype.$socket = new ApiSocket(socketUrl.toString(), pathname)
  }

  constructor(socketUrl, path) {
    this.socket = new SocketClient(socketUrl, { path })

    this.socket.on('connect', () => {
      if (localStorage[STORAGE_TOKEN]) {
        authenticateSocket(this.socket, localStorage[STORAGE_TOKEN])
      }
    })

    this.socket.on('user-error', ({ message = 'Something went wrong' }) => {
      console.error('socket.io recieved an error', message)
    })
  }

  emit(eventName, ...args) {
    console.debug('emit', eventName, ...args)

    this.socket.emit(eventName, ...args)
  }

  emitBinary(eventName, ...args) {
    console.debug('emitBinary', eventName, ...args)

    this.socket.binary(true).emit(eventName, ...args)
  }

  bindEvent(owner, eventName, callback) {
    console.debug('bindEvent', eventName)

    if (!this.listeners.has(eventName)) {
      this.socket.on(eventName, data => this.handleEvent(eventName, data))

      this.listeners.set(eventName, [])
    }

    this.listeners.get(eventName).push({ owner, callback })
  }

  unbindEvent(owner, eventName) {
    console.debug('unbindEvent', eventName)

    const listeners = this.listeners.get(eventName)
    if (!listeners) return

    const newListeners = listeners.filter(l => l.owner !== owner)

    if (newListeners.length === 0) {
      this.socket.off(eventName)
      this.listeners.delete(eventName)
    } else {
      this.listeners.set(eventName, newListeners)
    }
  }

  unbindAllEvents(owner) {
    Object.keys(this.listeners).forEach(k => {
      this.unbindEvent(owner, k)
    })
  }

  handleEvent(eventName, ...args) {
    const listeners = this.listeners.get(eventName) ?? []

    for (const l of listeners) l.callback(...args)
  }

  joinRoom(roomName) {
    this.socket.join(roomName)
  }

  leaveRoom(roomName) {
    this.socket.leave(roomName)
  }

  emitToRoom(roomName, event, ...args) {
    this.socket.to(roomName).emit(event, ...args)
  }
}

export function authenticateSocket(socket, token) {
  socket.emit('auth', token)
}
