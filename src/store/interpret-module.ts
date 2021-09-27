import { InterpretBooth, Interpreter } from '@openlab/deconf-shared'
import { createStateMapper } from '@openlab/deconf-ui-toolkit'
import { Module } from 'vuex'
import { SocketIoPlugin } from '@/plugins/socketio-plugin'

//
// TODO: migrate this back to deconf
//

export interface ActiveBooth {
  interpreter: Interpreter
  isSelf: boolean
  startTime: Date
}

export interface BoothMessage {
  user: string
  date: Date
  body: string
}

export interface InterpretationRequest {
  interpreter: Interpreter
  duration: number
}

export interface InterpretModuleState {
  self: null | Interpreter
  booth: null | InterpretBooth
  activeBooth: null | ActiveBooth
  messages: BoothMessage[]
  interpreters: Interpreter[]
}

export interface NewBoothMessage {
  message: string
  user: Interpreter
}

export type InterpretStoreModule = Module<InterpretModuleState, unknown>

export const mapInterpretState = createStateMapper<InterpretModuleState>()

export function interpretModule(): InterpretStoreModule {
  return {
    namespaced: true,
    state: () => ({
      self: null,
      booth: null,
      activeBooth: null,
      messages: [],
      interpreters: [],
    }),
    getters: {},
    mutations: {
      self(state, interpreter: Interpreter) {
        state.self = interpreter
      },
      join(state, booth: InterpretBooth) {
        state.booth = booth
      },
      leave(state) {
        state.booth = null
        state.activeBooth = null
        state.messages = []
        state.interpreters = []
      },
      messageBooth(state, { user, message }: NewBoothMessage) {
        state.messages = state.messages.concat([
          { date: new Date(), body: message, user: user.name },
        ])
      },

      startInterpret(state, interpreter: Interpreter) {
        const booth = state.booth
        if (!booth) {
          throw new Error('Cannot go live if not in a booth')
        }

        state.activeBooth = {
          interpreter,
          isSelf: interpreter.id === state.self?.id,
          startTime: new Date(),
        }
      },
      stopInterpret(state) {
        state.activeBooth = null
      },

      interpreterJoined(state, interpreter: Interpreter) {
        state.interpreters = state.interpreters
          .filter((i) => i.id !== interpreter.id)
          .concat([interpreter])
      },
      interpreterLeft(state, interpreter: Interpreter) {
        state.interpreters = state.interpreters.filter(
          (i) => i.id !== interpreter.id
        )
      },
    },
    actions: {
      joinBooth({ commit }, booth: InterpretBooth) {
        commit('join', booth)
        SocketIoPlugin.sharedSocket?.emit('joinBooth', booth)
      },
      leaveBooth({ commit }, booth: InterpretBooth) {
        commit('leave')
        SocketIoPlugin.sharedSocket?.emit('leaveBooth', booth)
      },
      messageBooth({ state }, message: string) {
        if (!state.booth) {
          throw new Error('Cannot message booth yet')
        }

        SocketIoPlugin.sharedSocket?.emit('messageBooth', state.booth, message)
      },
      sendAudio(ctx, data: ArrayBuffer) {
        SocketIoPlugin.sharedSocket?.emit('sendAudio', data)
      },

      startInterpret({ state, commit }, booth: InterpretBooth) {
        if (!state.self || !state.booth) {
          throw new Error('Cannot start interpreting yet')
        }
        commit('startInterpret', state.self)
        SocketIoPlugin.sharedSocket?.emit('startInterpret', booth)
      },
      stopInterpret({ commit }, booth: InterpretBooth) {
        commit('stopInterpret')
        SocketIoPlugin.sharedSocket?.emit('stopInterpret', booth)
      },
    },
  }
}
