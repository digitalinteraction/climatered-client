import { ScheduleFilterRecord } from '@openlab/deconf-ui-toolkit'

/** TODO: remove in favour of loadScheduleFilters */
export function createFilters(): ScheduleFilterRecord {
  return {
    query: '',
    sessionType: null,
    track: null,
    theme: null,
    date: null,
    isRecorded: null,
    viewMode: 'all',
  }
}
