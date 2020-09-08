const hasMatch = (value, query) => {
  return value.toLowerCase().includes(query.toLowerCase())
}

export default {
  methods: {
    applySearchQuery(sessions) {
      let query = this.searchQuery
      if (!query || query.length === 0) {
        return sessions
      }

      sessions = sessions.filter(s => {
        let titleHasMatched = false
        for (const languageCode in s.title) {
          if (hasMatch(s.title[languageCode], query)) {
            titleHasMatched = true
          }
        }
        let contentHasMatched = false
        for (const languageCode in s.content) {
          if (hasMatch(s.content[languageCode], query)) {
            contentHasMatched = true
          }
        }
        let hostNameHasMatched = false
        if (hasMatch(s.hostName, query)) {
          hostNameHasMatched = true
        }
        let hostOrganisationHasMatched = false
        for (const languageCode in s.hostOrganisation) {
          if (hasMatch(s.hostOrganisation[languageCode], query)) {
            hostOrganisationHasMatched = true
          }
        }
        let speakerHasMatched = false
        for (const speaker of s.speakers) {
          if (hasMatch(speaker.split('-').join(' '), query)) {
            speakerHasMatched = true
          }
        }
        return (
          titleHasMatched ||
          contentHasMatched ||
          speakerHasMatched ||
          hostNameHasMatched ||
          hostOrganisationHasMatched
        )
      })
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
