export default {
  methods: {
    applySearchQuery(sessions) {
      const start = Date.now()
      let query = this.searchQuery
      if (!query || query.length === 0) {
        return sessions
      }
      query = query.toLowerCase()

      sessions = sessions.filter(s => {
        let hasMatched = false
        for (const languageCode in s.title) {
          let titleHasMatched = false
          let contentHasMatched = false
          let speakerHasMatched = false

          titleHasMatched = s.title[languageCode].toLowerCase().includes(query)
          contentHasMatched = s.content[languageCode]
            .toLowerCase()
            .includes(query)

          speakerHasMatched = s.speakers
            .join('-')
            .split('-')
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase())

          if (titleHasMatched || contentHasMatched || speakerHasMatched) {
            hasMatched = true
          }
        }
        return hasMatched
      })
      const end = Date.now()
      console.log('time', parseInt(end) - parseInt(start))
      return sessions
    },
    applyFilters(sessions) {
      // Type filter
      sessions = this.filterByType(sessions)

      // Track filter
      sessions = this.filterByTrack(sessions)

      // Interactivity filter
      sessions = this.filterByInteractivity(sessions)

      // Platform filter
      sessions = this.filterByPlatform(sessions)

      // Device filter
      sessions = this.filterByDevice(sessions)

      // Recorded filter
      sessions = this.filterByRecorded(sessions)

      return sessions
    },
    filterByType(sessions) {
      if (this.activeFilters.type === 'All') {
        return sessions
      }
      sessions = sessions.filter(s => {
        return s.type.toLowerCase() === this.activeFilters.type.toLowerCase()
      })
      return sessions
    },
    filterByTrack(sessions) {
      if (this.activeFilters.track === 'All') {
        return sessions
      }
      sessions = sessions.filter(s => {
        return s.track.toLowerCase() === this.activeFilters.track.toLowerCase()
      })
      return sessions
    },
    filterByInteractivity(sessions) {
      if (this.activeFilters.interactivity === 'All') {
        return sessions
      }
      sessions = sessions.filter(s => {
        return s.attendeeInteraction === this.activeFilters.interactivity
      })
      return sessions
    },
    filterByPlatform(sessions) {
      // TODO: Platform filter
      return sessions
    },
    filterByDevice(sessions) {
      if (this.activeFilters.device === 'All') {
        return sessions
      }
      sessions = sessions.filter(s => {
        return s.attendeeDevices === this.activeFilters.device
      })
      return sessions
    },
    filterByRecorded(sessions) {
      if (this.activeFilters.recorded === 'All') {
        return sessions
      }
      sessions = sessions.filter(s => {
        if (this.activeFilters.recorded === 'recorded') {
          return s.isRecorded
        }
        if (this.activeFilters.recorded === 'not-recorded') {
          return !s.isRecorded
        }
      })
      return sessions
    }
  }
}
