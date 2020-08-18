import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '../i18n'

import Atrium from '../views/Atrium.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import TokenCapture from '../views/TokenCapture.vue'

const Sessions = () =>
  import(/* webpackChunkName: "attendee" */ '../views/Sessions.vue')
const Schedule = () =>
  import(/* webpackChunkName: "attendee" */ '../views/Schedule.vue')
const CoffeeChat = () =>
  import(/* webpackChunkName: "attendee" */ '../views/CoffeeChat.vue')
const Help = () =>
  import(/* webpackChunkName: "attendee" */ '../views/Help.vue')

const Register = () =>
  import(/* webpackChunkName: "register" */ '../views/Register.vue')

const Terms = () =>
  import(/* webpackChunkName: "static" */ '../views/Terms.vue')
const Privacy = () =>
  import(/* webpackChunkName: "static" */ '../views/Privacy.vue')
const ErrorPage = () =>
  import(/* webpackChunkName: "static" */ '../views/Error.vue')

const Event = () =>
  import(/* webpackChunkName: "prototype" */ '../views/Event.vue')
const Home = () =>
  import(/* webpackChunkName: "prototype" */ '../views/Home.vue')
const NotFound = () =>
  import(/* webpackChunkName: "prototype" */ '../views/NotFound.vue')
const Translator = () =>
  import(/* webpackChunkName: "prototype" */ '../views/Translator.vue')

const InterpretHome = () =>
  import(
    /* webpackChunkName: "interpret" */ '../views/interpret/InterpretHome.vue'
  )
const Interpret = () =>
  import(/* webpackChunkName: "interpret" */ '../views/interpret/Interpret.vue')

import {
  ROUTE_ATRIUM,
  ROUTE_EVENT,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_NOT_FOUND,
  ROUTE_TRANSLATOR,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_PROFILE,
  ROUTE_TERMS,
  ROUTE_ERROR,
  ROUTE_PRIVACY,
  ROUTE_SESSIONS,
  ROUTE_INTERPRET_HOME,
  ROUTE_INTERPRET
} from '../const'

Vue.use(VueRouter)

const routes = [
  {
    path: '/atrium',
    name: ROUTE_ATRIUM,
    component: Atrium,
    meta: {
      titleKey: 'atrium.title'
    }
  },
  {
    path: '/sessions',
    name: ROUTE_SESSIONS,
    component: Sessions,
    meta: {
      titleKey: 'sessions.title'
    }
  },
  {
    path: '/schedule',
    name: ROUTE_SCHEDULE,
    component: Schedule,
    meta: {
      titleKey: 'schedule.title'
    }
  },
  {
    path: '/coffee',
    name: ROUTE_COFFEE_CHAT,
    component: CoffeeChat,
    meta: {
      titleKey: 'coffeechat.title'
    }
  },
  {
    path: '/help',
    name: ROUTE_HELP,
    component: Help,
    meta: {
      titleKey: 'help.title'
    }
  },
  {
    path: '/me',
    name: ROUTE_PROFILE,
    component: Profile,
    meta: {
      titleKey: 'profile.title'
    }
  },
  //
  // Auth bits
  //
  {
    path: '/login',
    name: ROUTE_LOGIN,
    component: Login,
    meta: {
      titleKey: 'login.title'
    }
  },
  {
    path: '/register',
    name: ROUTE_REGISTER,
    component: Register,
    meta: {
      titleKey: 'register.title'
    }
  },
  {
    path: '/_token',
    name: ROUTE_TOKEN_CAPTURE,
    component: TokenCapture,
    meta: {
      title: 'Working...'
    }
  },
  {
    path: '/not-found',
    name: ROUTE_NOT_FOUND,
    component: NotFound,
    meta: {
      titleKey: 'notfound.title'
    }
  },
  //
  // static pages
  //
  {
    path: '/terms',
    name: ROUTE_TERMS,
    component: Terms,
    meta: {
      titleKey: 'terms.title'
    }
  },
  {
    path: '/privacy',
    name: ROUTE_PRIVACY,
    component: Privacy,
    meta: {
      titleKey: 'privacy.title'
    }
  },
  {
    path: '/error',
    component: ErrorPage,
    name: ROUTE_ERROR,
    meta: {
      title: 'Error'
    }
  },
  //
  // Interpretation
  //
  {
    path: '/interpret',
    component: InterpretHome,
    name: ROUTE_INTERPRET_HOME,
    meta: {
      titleKey: 'interpretHome.title'
    }
  },
  {
    path: '/interpret/:sessionId/:channel',
    component: Interpret,
    name: ROUTE_INTERPRET,
    props: true,
    meta: {
      titleKey: 'interpret.title'
    }
  },
  //
  // v0 prototype
  //
  {
    path: '/prototype',
    component: Home,
    meta: {
      title: 'v0'
    }
  },
  {
    path: '/prototype/event/:eventId',
    name: ROUTE_EVENT,
    component: Event,
    props: true,
    meta: {
      title: 'v0 | Event'
    }
  },
  {
    path: '/prototype/translator/:eventId',
    name: ROUTE_TRANSLATOR,
    component: Translator,
    props: true,
    meta: {
      title: 'v0 | translator'
    }
  },
  //
  // NotFound fallback
  //
  {
    path: '*',
    component: NotFound,
    meta: {
      titleKey: 'notFound.title'
    }
  }
]

//
// Using this breaks the browser's normal flow, which isn't ideal
//
const scrollOffset = 80 // 5.25rem into pixels ($navbar-height + tabbar height)
function scrollBehavior(to, from, savedPosition) {
  // If they clicked on a hash, scroll to that
  if (to.hash) {
    return {
      selector: to.hash,
      offset: { x: 0, y: scrollOffset }
    }
  }

  // If they've been to the page, scroll back to there
  if (savedPosition) return savedPosition

  // Otherwise, its a new page so go to the top
  return { x: 0, y: 0 }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'is-active',
  scrollBehavior
})

router.beforeEach((to, from, next) => {
  const findMeta = key =>
    to.matched.reverse().find(r => r.meta?.[key])?.meta?.[key]

  const titleKey = findMeta('titleKey')
  const title = findMeta('title')

  const appName = i18n.t('general.appName')
  const seperator = '-'

  if (titleKey) {
    document.title = `${i18n.t(titleKey)} ${seperator} ${appName}`
  } else if (title) {
    document.title = `${title} ${seperator} ${appName}`
  } else {
    document.title = appName
  }

  next()
})

export default router
