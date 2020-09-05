import { mapState } from 'vuex'

const publicTabs = new Set(['atrium', 'sessions'])

export default {
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState'])
  },
  methods: {
    scheduleLive() {
      return this.hasData && this.settings.scheduleLive
    },
    /** Wether a tab should be shown or "coming-soon" */
    tabIsActive(tabName) {
      // The helpdesk is tied to its own setting
      if (tabName === 'helpdesk') return this.settings?.enableHelpdesk

      // The coffeechat is tied to its own setting
      if (tabName === 'coffeechat') return this.settings?.enableCoffeechat

      // If the schedule is live any other tab is enabled
      // otherwise only public tabs are enabled
      return this.scheduleLive || publicTabs.has(tabName)
    },
    /** Whether the current user can access a tab */
    tabIsAllowed(tabName) {
      console.log(tabName, this.user, publicTabs.has(tabName))
      return this.user || publicTabs.has(tabName)
    },
    tabIsDisabled(tabName) {
      // return false
      return !this.tabIsActive(tabName) || !this.tabIsAllowed(tabName)
    }
  }
}
