import ky from 'ky'
import {
  ApiStoreModule,
  createApiStoreModule,
  decodeJwt,
  deepSeal,
  SessionAttendance,
} from '@openlab/deconf-ui-toolkit'
import { pause } from '@openlab/deconf-ui-toolkit'

import { env } from '@/plugins/env-plugin'
import { StorageKey, LocalisedContent } from '@/lib/module'
import {
  CarbonCalculation,
  Registration,
  Session,
  SessionLink,
} from '@openlab/deconf-shared'

const API_DELAY = 300

function requestMiddleware(request: Request) {
  const token = localStorage.getItem(StorageKey.AuthToken)
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
}

function errorHandler(error: unknown) {
  // TODO: metrics? - can anything meaningful be gleamed here?
  console.error(error)
  return null
}

interface ProfileResponse {
  registration: Registration
}

export function apiModule(): ApiStoreModule {
  const agent = ky.extend({
    prefixUrl: env.SERVER_URL,
    hooks: {
      beforeRequest: [requestMiddleware],
    },
  })

  return {
    ...createApiStoreModule(),
    actions: {
      authenticate({ commit, dispatch }, token: string) {
        const user = decodeJwt(token)
        commit('user', user)

        dispatch('fetchUserAttendance')

        return dispatch('fetchData')
      },

      async fetchData({ commit }) {
        try {
          const data = await agent.get('schedule').json()

          commit('schedule', data)
          return true
        } catch (error) {
          console.error(error)
          commit('schedule', null)
          return false
        }
      },
      async fetchWhatsOn() {
        const response = await agent
          .get('schedule/whats-on')
          .json<{ sessions: Session[] }>()
          .catch(errorHandler)

        return response?.sessions
      },

      //
      // Auth
      //
      async login(ctx, email: string) {
        const response = await agent.post('auth/login', {
          json: { email },
        })

        await pause(API_DELAY)

        return response.ok
      },

      async register(ctx, registration: unknown) {
        const response = await agent.post('auth/register', {
          json: registration,
        })

        await pause(API_DELAY)

        return response.ok
      },

      async unregister() {
        const response = await agent.delete('auth/me')
        await pause(API_DELAY)
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
      async fetchLinks(ctx, sessionId: string) {
        const result = await agent
          .get(`schedule/${sessionId}/links`)
          .json<{ links: SessionLink[] }>()
          .catch(errorHandler)

        return deepSeal(result)
      },

      async fetchSessionAttendance(ctx, sessionId: string) {
        const result = await agent
          .get(`attendance/${sessionId}`)
          .json<SessionAttendance>()
          .catch(errorHandler)

        // TODO: investigate int/string on the count
        return deepSeal(result)
      },

      async attend({ dispatch }, sessionId: string) {
        const result = await agent
          .post(`attendance/${sessionId}/attend`)
          .catch(errorHandler)

        dispatch('fetchUserAttendance')

        await pause(API_DELAY)

        return deepSeal(result)
      },

      async unattend({ dispatch }, sessionId: string) {
        const result = await agent
          .post(`attendance/${sessionId}/unattend`)
          .catch(errorHandler)

        dispatch('fetchUserAttendance')

        await pause(API_DELAY)

        return deepSeal(result)
      },

      async fetchUserAttendance({ commit }) {
        const result = await agent
          .get('attendance/me')
          .json<{ sessions: string[] }>()
          .catch(errorHandler)

        if (result) commit('userSessions', result.sessions)

        return deepSeal(result)
      },

      //
      // Content
      //
      async fetchContent(ctx, slug: string) {
        const data = await agent
          .get(`content/${slug}`)
          .json<{ content: LocalisedContent }>()
          .catch(errorHandler)

        return data ? deepSeal(data.content) : null
      },
    },
  }
}
