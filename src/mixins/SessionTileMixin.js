// Constants
import { ROUTE_SESSION } from '@/const'

export default {
  props: {
    session: { type: Object, required: true }
  },
  filters: {
    trim: function(value, length) {
      if (value.length < length) return value
      return `${value.substring(0, length)}...`
    }
  },
  computed: {
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeContent() {
      let content = this.session.content[this.$i18n.locale]
      return content
    },
    localeHostOrganisation() {
      return this.session.hostOrganisation[this.$i18n.locale]
    },
    sessionRoute() {
      return {
        name: ROUTE_SESSION,
        params: { sessionSlug: this.session.slug }
      }
    },
    conferenceIsOver() {
      return this.$store.state.api.settings.conferenceIsOver
    }
  }
}
