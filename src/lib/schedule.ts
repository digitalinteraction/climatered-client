import { Session } from '@openlab/deconf-shared'
import {
  createFilterPredicate,
  DailySessions,
  FullSchedule,
  groupSessionsByDay,
  groupSessionsBySlot,
  ScheduleFilterRecord,
  SessionPredicate,
  SlotWithSessions,
} from '@openlab/deconf-ui-toolkit'

export interface ScheduleThis extends ScheduleComputed {
  $i18n: {
    locale: string
  }
  filters: ScheduleFilterRecord
  schedule: FullSchedule
  userSessions: string[]
  isDuringConference: boolean
  scheduleDate: Date
}

export interface ScheduleComputed {
  filterPredicate: SessionPredicate | null
  filteredSessions: Session[]
  sessionsByDay: DailySessions[]
  previousDays: DailySessions[] | null
  upcomingDays: DailySessions[] | null
  searchResults: DailySessions[] | null
}

type ComputedGenerator<T> = {
  [K in keyof T]: (this: ScheduleThis) => T[K]
}

function filterGroups(
  days: DailySessions[],
  predicate: (group: SlotWithSessions) => boolean
): DailySessions[] {
  return days
    .map((day) => ({
      title: day.title,
      date: day.date,
      groups: day.groups.filter((g) => predicate(g)),
    }))
    .filter((d) => d.groups.length > 0)
}

export function scheduleComputed(): ComputedGenerator<ScheduleComputed> {
  return {
    filterPredicate() {
      return createFilterPredicate(
        this.$i18n.locale,
        this.filters,
        this.schedule
      )
    },

    filteredSessions() {
      const showUserSessions = this.filters.viewMode === 'user'
      const userSessions = new Set(this.userSessions)

      return (this.schedule as FullSchedule).sessions.filter((session) => {
        if (showUserSessions && !userSessions.has(session.id)) return false

        if (this.filterPredicate && !this.filterPredicate(session)) return false

        return true
      })
    },

    sessionsByDay(): DailySessions[] {
      return groupSessionsByDay(
        this.filteredSessions,
        (this.schedule as FullSchedule).slots
      )
    },

    previousDays() {
      // If outside the conference or there is an active filter, do nothing
      if (!this.isDuringConference || this.filterPredicate) return null

      const now = this.scheduleDate.getTime()

      return filterGroups(
        this.sessionsByDay,
        (group) => group.slot.end.getTime() < now
      )
    },
    upcomingDays() {
      if (this.filterPredicate !== null) return this.searchResults
      if (!this.isDuringConference) return this.sessionsByDay

      const now = this.scheduleDate.getTime()

      return filterGroups(
        this.sessionsByDay,
        (group) => group.slot.end.getTime() > now
      )
    },
    searchResults() {
      if (!this.filterPredicate) return null

      return [
        {
          title: 'Search Results',
          date: new Date(),
          groups: groupSessionsBySlot(
            this.filteredSessions,
            this.schedule.slots
          ),
        },
      ]
    },
  }
}
