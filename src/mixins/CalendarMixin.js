export default {
  methods: {
    getLocaleTitle(session) {
      return session.title[this.$i18n.locale]
    },
    getEventStart(slot) {
      return this.$options.filters.localeDateTime(slot.start)
    },
    getEventEnd(slot) {
      return this.$options.filters.localeDateTime(slot.end)
    },
    getEventUrl(session) {
      return `https://climate.red/session/${session.id}` // TODO: Update URL
    },
    getEventOrganizer(session) {
      return {
        name: session.hostOrganisation[this.$i18n.locale],
        email: 'support@climate.red' // TODO: Update email
      }
    },
    getEventDescription(session) {
      return this.$store.getters['api/type'](session.type)?.title[
        this.$i18n.locale
      ]
    },
    addSessionToCalendar(session, slot) {
      // TODO: addCal (alias)
      // Remove existing events
      this.$ics.removeAllEvents()

      // Add new event
      this.$ics.addEvent(
        this.$i18n.locale, // Language
        this.getLocaleTitle(session), // Subject
        this.getEventDescription(session), // Description
        'climate:red', // Location (e.g. Online event)
        this.getEventStart(slot), // Beginnning date of event
        this.getEventEnd(slot), // Ending date of event
        this.getEventUrl(session), // URL
        this.getEventOrganizer(session) // Organiser
      )

      // Download event
      this.$ics.download(this.session.slug)
    }
  }
}
