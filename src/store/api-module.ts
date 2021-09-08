import ky from 'ky'
import {
  ApiModule,
  ApiState,
  createApiStoreModule,
  lib,
} from '@openlab/deconf-ui-toolkit'

import { env } from '@/plugins/env-plugin'
import { LocalisedContent } from '@/lib/api-types'
import { TOKEN_STORAGE_KEY } from '@/lib/constants'

function requestMiddleware(request: Request) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
}

export function apiModule(): ApiModule {
  const agent = ky.extend({
    prefixUrl: env.SERVER_URL,
    throwHttpErrors: false,
    hooks: {
      beforeRequest: [requestMiddleware],
    },
  })

  return {
    ...createApiStoreModule(),
    actions: {
      authenticate({ commit, dispatch }, token: string) {
        const user = lib.decodeJwt(token)
        commit('user', user)

        dispatch('fetchUserAttendance')

        return dispatch('fetchData')
      },

      async fetchData({ commit }) {
        try {
          const data = await agent.get('schedule').json()
          commit('schedule', data)
          commit('state', ApiState.ready)
          return true
        } catch (error) {
          console.error(error)
          commit('schedule', null)
          commit('state', ApiState.error)
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
          const { profile } = await agent
            .get('auth/me')
            .json<lib.ProfileResponse>()

          commit('profile', {
            ...profile,
            created: new Date(profile.created),
          })
        } catch (error) {
          console.error(error)
          commit('profile', null)
        }
      },

      async updateProfile() {
        // TODO
      },

      //
      // Attendance
      //

      async fetchSessionAttendance(ctx, sessionId: string) {
        const data = await agent
          .get(`attendance/${sessionId}`)
          .json<lib.SessionAttendance>()

        // TODO: investigate int/string on the count
        return lib.deepSeal(data)
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
