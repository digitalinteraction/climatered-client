import ky from 'ky'
import {
  ApiStoreModule,
  createApiStoreModule,
  decodeJwt,
  deepSeal,
} from '@openlab/deconf-ui-toolkit'

import { env } from '@/plugins/env-plugin'
import { StorageKey, LocalisedContent } from '@/lib/module'
import {
  CarbonCalculation,
  Registration,
  SessionAttendance,
} from '@openlab/deconf-shared'

function requestMiddleware(request: Request) {
  const token = localStorage.getItem(StorageKey.AuthToken)
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
}

interface ProfileResponse {
  registration: Registration
}

export function apiModule(): ApiStoreModule {
  const agent = ky.extend({
    prefixUrl: env.SERVER_URL,
    throwHttpErrors: false,
    hooks: {
      beforeRequest: [requestMiddleware],
    },
  })

  return {
    ...createApiStoreModule(),
    getters: {
      calendarLink: () => () => ``,
    },
    actions: {
      authenticate({ commit, dispatch }, token: string) {
        const user = decodeJwt(token)
        commit('user', user)

        dispatch('fetchUserAttendance')

        return dispatch('fetchData')
      },

      async fetchData({ commit }) {
        try {
          const data = await agent.get('schedule').json<any>()

          // TODO: make this hack unneeded
          Object.defineProperty(data, 'sessionTypes', {
            get: () => data.types,
          })

          commit('schedule', data)
          return true
        } catch (error) {
          console.error(error)
          commit('schedule', null)
          return false
        }
      },

      //
      // Auth
      //
      async login(ctx, email: string) {
        const response = await agent.post('auth/login', {
          json: { email },
        })

        return response.ok
      },

      async register(ctx, registration: unknown) {
        const response = await agent.post('auth/register', {
          json: registration,
        })

        return response.ok
      },

      async unregister() {
        const response = await agent.delete('auth/me')
        return response.ok
      },

      async fetchProfile({ commit }) {
        try {
          const { registration } = await agent
            .get('auth/me')
            .json<ProfileResponse>()

          commit('profile', registration)
        } catch (error) {
          console.error(error)
          commit('profile', null)
        }
      },

      async updateProfile() {
        // TODO
      },

      //
      // Carbon
      //
      async fetchCarbon({ commit }) {
        try {
          const carbon = await agent.get('carbon').json<CarbonCalculation>()

          commit('carbon', carbon)
        } catch (error) {
          console.error(error)
          commit('carbon', null)
        }
      },

      //
      // Attendance
      //

      async fetchSessionAttendance(ctx, sessionId: string) {
        const data = await agent
          .get(`attendance/${sessionId}`)
          .json<SessionAttendance>()

        // TODO: investigate int/string on the count
        return deepSeal(data)
      },

      async attend({ dispatch }, sessionId: string) {
        await agent.post(`attendance/${sessionId}/attend`)
        dispatch('fetchUserAttendance')
      },

      async unattend({ dispatch }, sessionId: string) {
        await agent.post(`attendance/${sessionId}/unattend`)
        dispatch('fetchUserAttendance')
      },

      async fetchUserAttendance({ commit }) {
        const data = await agent
          .get('attendance/me')
          .json<{ sessions: string[] }>()

        commit('userSessions', data.sessions)
      },

      //
      // Content
      //
      async fetchContent(ctx, slug: string) {
        const data = await agent
          .get(`content/${slug}`)
          .json<{ content: LocalisedContent }>()
          .catch(() => null)

        return data?.content
      },
    },
  }
}
