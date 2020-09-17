import { mapState } from 'vuex'

import {
  ROUTE_ATRIUM,
  ROUTE_SESSIONS,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_PROFILE,
  ROUTE_INTERPRET_HOME
} from '../const'

const publicTabs = new Set(['atrium', 'sessions'])

const nav = [
  {
    name: 'atrium',
    icon: AtriumIcon,
    to: { name: ROUTE_ATRIUM },
    titleKey: 'atrium.title',
    public: true
  },
  {
    name: 'sessions',
    icon: SessionsIcon,
    to: { name: ROUTE_SESSIONS },
    titleKey: 'sessions.title',
    public: false
  },
  {
    name: 'schedule',
    icon: ScheduleIcon,
    to: { name: ROUTE_SCHEDULE },
    titleKey: 'schedule.title',
    public: false
  },
  {
    name: 'coffeechat',
    icon: CoffeeChatIcon,
    to: { name: ROUTE_COFFEE_CHAT },
    titleKey: 'coffeechat.title',
    public: false
  },
  {
    name: 'helpdesk',
    icon: HelpDeskIcon,
    to: { name: ROUTE_HELP },
    titleKey: 'help.title',
    public: false
  }
]

import CoffeeChatIcon from '@/icons/coffee-chat.svg'
import HelpDeskIcon from '@/icons/help-desk.svg'
import AtriumIcon from '@/icons/atrium.svg'
import ScheduleIcon from '@/icons/schedule.svg'
import SessionsIcon from '@/icons/whats-on.svg'

export default {
  data() {
    return {
      loginRoute: { name: ROUTE_LOGIN },
      registerRoute: { name: ROUTE_REGISTER },
      atriumRoute: { name: ROUTE_ATRIUM },
      sessionsRoute: { name: ROUTE_SESSIONS },
      scheduleRoute: { name: ROUTE_SCHEDULE },
      coffeeRoute: { name: ROUTE_COFFEE_CHAT },
      helpRoute: { name: ROUTE_HELP },
      profileRoute: { name: ROUTE_PROFILE },
      interpretRoute: { name: ROUTE_INTERPRET_HOME },
      nav
    }
  },
  computed: {
    ...mapState('api', ['user', 'settings', 'apiState']),
    isTranslator() {
      return this.user?.user_roles.includes('translator')
    },
    currentNav() {
      const filterOut = new Set()

      if (this.scheduleLive) {
        filterOut.add('sessions')
      } else {
        filterOut.add('schedule')
      }

      return this.nav.filter(item => !filterOut.has(item.name))
    },
    disabledKey() {
      return this.conferenceIsOver()
        ? 'general.unavailable'
        : 'general.comingSoon'
    }
  },
  methods: {
    scheduleLive() {
      return Boolean(this.settings?.scheduleLive)
    },
    conferenceIsOver() {
      return Boolean(this.settings?.conferenceIsOver)
    },
    /** Wether a tab should be shown or "coming-soon" */
    tabIsActive(tabName) {
      // The helpdesk is tied to its own setting
      if (tabName === 'helpdesk') return this.settings?.enableHelpdesk

      // The coffeechat is tied to its own setting
      if (tabName === 'coffeechat') return this.settings?.enableCoffeechat

      // If the schedule is live any other tab is enabled
      // otherwise only public tabs are enabled
      return this.scheduleLive() || publicTabs.has(tabName)
    },
    /** Whether the current user can access a tab */
    tabIsAllowed(tabName) {
      return (
        Boolean(this.user) || this.conferenceIsOver() || publicTabs.has(tabName)
      )
    },
    tabIsDisabled(tabName) {
      return !this.tabIsActive(tabName) || !this.tabIsAllowed(tabName)
    }
  }
}
