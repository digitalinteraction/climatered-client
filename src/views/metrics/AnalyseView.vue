<template>
  <IfrcUtilLayout>
    <h1 class="title">Metrics</h1>
    <p v-if="!authenticated" class="notification is-danger">
      You must be logged in to view this page
    </p>
    <template v-else>
      <!--
        Report Picker
      -->
      <div class="field">
        <SegmentControl v-model="report" :options="reportOptions" />
      </div>
      <!--
        Date fields
      -->
      <Stack
        v-if="startDate && endDate"
        direction="horizontal"
        gap="regular"
        align="center"
      >
        <div class="inlineField">
          <button class="button is-static">Start Date</button>
          <DateInput v-model="startDate" />
        </div>
        <div class="inlineField">
          <button class="button is-static">End Date</button>
          <DateInput v-model="endDate" />
        </div>
        <button class="button is-danger is-light" @click="stopDateFilter">
          <span class="icon">
            <fa :icon="['fas', 'times']" />
          </span>
        </button>
      </Stack>
      <div class="buttons" v-else>
        <button class="button is-primary is-light" @click="startDateFilter">
          Filter by date
        </button>
      </div>

      <hr />

      <!--
        Message
      -->
      <pre v-html="reportMessage"></pre>
    </template>
  </IfrcUtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcUtilLayout from '@/components/IfrcUtilLayout.vue'
import {
  mapApiState,
  SelectOption,
  SegmentControl,
  Stack,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import DateInput from '@/components/DateInput.vue'

interface MetricsRecord {
  eventName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  created: Date
}

interface AttendeeCount {
  count: string
  verified: boolean
}

function mapIncrease(map: Map<string, number>, key: string, change = 1) {
  map.set(key, (map.get(key) ?? 0) + change)
}

function sortMap(map: Map<string, number>) {
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

function startOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function endOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

const knownRoutes = new Set(Object.values(Routes))

interface Data {
  events: MetricsRecord[]
  attendeesCounts: AttendeeCount[]
  report: string
  reportOptions: SelectOption[]

  startDate: Date | null
  endDate: Date | null
}

export default Vue.extend({
  components: { IfrcUtilLayout, SegmentControl, DateInput, Stack },
  data(): Data {
    return {
      events: [],
      attendeesCounts: [],
      report: 'pages',
      reportOptions: [
        { value: 'pages', text: 'Page Views' },
        { value: 'atriumWidgets', text: 'Atrium' },
        { value: 'ical', text: 'Calendar' },
        { value: 'attendees', text: 'Attendees' },
      ],
      startDate: null,
      endDate: null,
    }
  },
  computed: {
    ...mapApiState('api', ['user']),
    authenticated(): boolean {
      return this.user?.user_roles.includes('admin') ?? false
    },
    filteredEvents(): MetricsRecord[] {
      if (!this.startDate || !this.endDate) return this.events
      const start = startOfDay(this.startDate).getTime()
      const end = endOfDay(this.endDate).getTime()

      return this.events.filter(
        (e) => e.created.getTime() >= start && e.created.getTime() <= end
      )
    },
    reportMessage(): string {
      const message: string[] = []

      // Page views
      if (this.report === 'pages') {
        const routes = new Map<string, number>()

        for (const event of this.filteredEvents) {
          if (event.eventName !== 'general/pageView') continue
          let href = event.payload.routeName
          if (knownRoutes.has(href)) {
            href = this.$router.resolve({
              name: event.payload.routeName,
              params: event.payload.params,
            }).href
          }
          mapIncrease(routes, href, 1)
        }

        for (const [route, count] of sortMap(routes)) {
          message.push(`${route} (${count})`)
        }
      }

      // Atrium widgets
      if (this.report === 'atriumWidgets') {
        const actions = new Map<string, number>()
        for (const event of this.filteredEvents) {
          if (event.eventName !== 'atrium/widget') continue
          mapIncrease(actions, event.payload.widget)
        }

        for (const [action, count] of sortMap(actions)) {
          message.push(`${action} (${count})`)
        }
      }

      // ical downloads
      if (this.report === 'ical') {
        const sessions = new Map<string, number>()
        for (const event of this.filteredEvents) {
          if (event.eventName !== 'session/ical') continue
          mapIncrease(sessions, event.payload.sessionId)
        }

        for (const [sessionId, count] of sortMap(sessions)) {
          message.push(`session/${sessionId} (${count})`)
        }
      }

      // Attendees
      if (this.report === 'attendees') {
        for (const record of this.attendeesCounts) {
          const v = record.verified ? 'Verified' : 'Unverified'
          message.push(`${v} (${record.count})`)
        }
      }

      return message.join('\n')
    },
  },
  mounted() {
    this.$io.socket.emit('startAnalyse')
    this.$io.socket.on('liveEvent', (event) => {
      console.log('liveEvent', event)

      this.events.push(this.hydrate(event))
    })
    this.$io.socket.on('liveError', (error) => {
      console.log('liveError', error)
    })

    this.fetchData()
  },
  destroyed() {
    this.$io.socket.emit('stopAnalyse')
    this.$io.socket.off('liveEvent')
    this.$io.socket.off('liveError')
  },
  methods: {
    async fetchData() {
      this.attendeesCounts = await this.$store.dispatch(
        'api/fetchAttendeeCounts'
      )
      this.events = await this.$store.dispatch('api/fetchMetrics')
      this.events = this.events?.map((e) => this.hydrate(e))
    },
    startDateFilter() {
      this.startDate = new Date()
      this.startDate.setHours(-24)

      this.endDate = new Date()
      this.endDate.setHours(24)
    },
    stopDateFilter() {
      this.startDate = null
      this.endDate = null
    },
    hydrate(e: MetricsRecord) {
      e.created = new Date(e.created)
      return e
    },
  },
})
</script>
