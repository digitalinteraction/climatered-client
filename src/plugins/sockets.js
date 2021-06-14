import { pickApi, isStaticSite } from '../utils'
import { STORAGE_TOKEN } from '../const'
import SocketClient from 'socket.io-client'

const safeLiterals = new Set(['string', 'number', 'boolean'])

function logSocket(direction, eventName, args) {
  const safeArgs = args.filter(a => safeLiterals.has(typeof a))

  console.debug(direction, eventName, ...safeArgs)
}

export default class ApiSocket {
  listeners = new Map()

  static install(Vue) {
    Vue.prototype.$socket = sharedSocket
  }

  constructor() {
    const apiBase = pickApi()

    const pathname = new URL(apiBase).pathname.replace(/\/?$/, '/socket.io')

    const socketUrl = new URL(apiBase)
    socketUrl.protocol = socketUrl.protocol.replace(/^http/, 'ws')
    socketUrl.pathname = '/'

    this.socket = new SocketClient(socketUrl.toString(), {
      path: pathname,
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      if (localStorage[STORAGE_TOKEN]) {
        authenticateSocket(this.socket, localStorage[STORAGE_TOKEN])
      }

      this.emit('online')
    })

    this.socket.on('user-error', ({ message = 'Something went wrong' }) => {
      console.error('socket.io recieved an error', message)
    })
  }

  emit(eventName, ...args) {
    logSocket('↑', eventName, args)

    this.socket.emit(eventName, ...args)
  }

  emitBinary(eventName, ...args) {
    logSocket('↑', eventName, args)

    this.socket.binary(true).emit(eventName, ...args)
  }

  emitAndWait(eventName, ...args) {
    return new Promise(resolve => {
      this.emit(...[eventName, ...args, resolve])
    })
  }

  bindEvent(owner, eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.socket.on(eventName, (...args) =>
        this.handleEvent(eventName, ...args)
      )

      this.listeners.set(eventName, [])
    }

    this.listeners.get(eventName).push({ owner, callback })
  }

  unbindEvent(owner, eventName) {
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

  unbindOwner(owner) {
    for (const eventName of this.listeners.keys()) {
      this.unbindEvent(owner, eventName)
    }
  }

  handleEvent(eventName, ...args) {
    logSocket('↓', eventName, args)
    const listeners = this.listeners.get(eventName) ?? []

    for (const l of listeners) l.callback(...args)
  }
}

class NonSocket {
  emit() {}
  emitBinary() {}
  async emitAndWait() {}
  bindEvent() {}
  unbindEvent() {}
  unbindOwner() {}
  handleEvent() {}
}

export const sharedSocket = isStaticSite() ? new NonSocket() : new ApiSocket()

export function authenticateSocket(socket, token) {
  socket.emit('auth', token)
}
