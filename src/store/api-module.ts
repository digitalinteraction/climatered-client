import ky from 'ky'
import {
  ApiStoreModule,
  createApiStoreModule,
  decodeJwt,
  deepSeal,
  FullSchedule,
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
import { SocketIoPlugin } from '@/plugins/socketio-plugin'

interface AttendanceRecord {
  id: number
  created: string
  session: string
}

const API_DELAY = 300

function requestMiddleware(request: Request) {
  const token = localStorage.getItem(StorageKey.AuthToken)
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
}

function errorHandler(error: unknown) {
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

        SocketIoPlugin.authenticate(token)

        dispatch('fetchUserAttendance')

        return dispatch('fetchData')
      },

      async fetchData({ commit }) {
        const data = await agent
          .get('schedule')
          .json<FullSchedule>()
          .catch(errorHandler)

        commit('schedule', data)
        return data !== null
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
        const response = await agent
          .post('auth/login', {
            json: { email },
          })
          .catch(errorHandler)

        await pause(API_DELAY)

        return response?.ok ?? false
      },

      async register(ctx, registration: unknown) {
        const response = await agent
          .post('auth/register', {
            json: registration,
          })
          .catch(errorHandler)

        await pause(API_DELAY)

        return response?.ok ?? false
      },

      async unregister() {
        const response = await agent.delete('auth/me').catch(errorHandler)
        await pause(API_DELAY)
        return response?.ok ?? false
      },

      async fetchProfile({ commit }) {
        const response = await agent
          .get('auth/me')
          .json<ProfileResponse>()
          .catch(errorHandler)

        commit('profile', response?.registration ?? null)
      },

      async updateProfile() {
        // ...
      },

      //
      // Carbon
      //
      async fetchCarbon({ commit }) {
        const response = await agent
          .get('carbon')
          .json<CarbonCalculation>()
          .catch(errorHandler)

        commit('carbon', response)
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
          .json<{ attendance: AttendanceRecord[] }>()
          .catch(errorHandler)

        if (result) {
          commit(
            'userSessions',
            result.attendance.map((a) => a.session)
          )
        } else {
          commit('userSessions', null)
        }

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

      //
      // Metrics
      //
      async fetchMetrics() {
        const data = await agent
          .get('metrics')
          .json<{ events: unknown[] }>()
          .catch(errorHandler)

        if (data) data.events = data.events.map((e) => deepSeal(e))

        return data ? data.events : null
      },
      async fetchAttendeeCounts() {
        const data = await agent
          .get('metrics/attendees')
          .json<{ attendees: unknown[] }>()
          .catch(errorHandler)

        return data ? deepSeal(data.attendees) : null
      },
      async fetchAttendanceCounts() {
        const data = await agent
          .get('metrics/attendance')
          .json<{ attendance: unknown[] }>()
          .catch(errorHandler)

        return data ? deepSeal(data.attendance) : null
      },
    },
  }
}
