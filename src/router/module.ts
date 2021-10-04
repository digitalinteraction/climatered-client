import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'

import { createPageViewEvent, Routes } from '@openlab/deconf-ui-toolkit'

import i18n from '../i18n/module'
import { StorageKey } from '../lib/constants'
import { MetricsPlugin } from '../plugins/metrics-plugin'

Vue.use(VueRouter)

//
// Core
//
const Atrium = () =>
  import(
    /* webpackChunkName: "core" */
    '../views/main/AtriumView.vue'
  )
const TokenCapture = () =>
  import(
    /* webpackChunkName: "core" */
    '../views/auth/TokenCaptureView.vue'
  )
const ApiError = () =>
  import(
    /* webpackChunkName: "core" */
    '../views/pages/ApiErrorView.vue'
  )
const NotFound = () =>
  import(
    /* webpackChunkName: "core" */
    '../views/pages/NotFoundView.vue'
  )

//
// Sessions
//
const WhatsOn = () =>
  import(
    /* webpackChunkName: "sessions" */
    '../views/main/WhatsOnView.vue'
  )
const Schedule = () =>
  import(
    /* webpackChunkName: "sessions" */
    '../views/main/ScheduleView.vue'
  )
const Session = () =>
  import(
    /* webpackChunkName: "sessions" */
    '../views/main/SessionView.vue'
  )

//
// Misc
//
const CoffeeLobby = () =>
  import(
    /* webpackChunkName: "coffee" */
    '../views/main/CoffeeLobbyView.vue'
  )
const Help = () =>
  import(
    /* webpackChunkName: "help" */
    '../views/main/HelpDeskView.vue'
  )

//
// Auth
//
const Login = () =>
  import(
    /* webpackChunkName: "auth" */
    '../views/auth/LoginView.vue'
  )
const Register = () =>
  import(
    /* webpackChunkName: "auth" */
    '../views/auth/RegisterView.vue'
  )
const Profile = () =>
  import(
    /* webpackChunkName: "auth" */
    '../views/auth/ProfileView.vue'
  )

//
// Pages
//
const Terms = () =>
  import(
    /* webpackChunkName: "pages" */
    '../views/pages/TermsView.vue'
  )
const Privacy = () =>
  import(
    /* webpackChunkName: "pages" */
    '../views/pages/PrivacyView.vue'
  )
const Guidelines = () =>
  import(
    /* webpackChunkName: "pages" */
    '../views/pages/GuidelinesView.vue'
  )
const Contact = () =>
  import(
    /* webpackChunkName: "pages" */
    '../views/pages/ContactView.vue'
  )

//
// Interpret
//
const InterpretHome = () =>
  import(
    /* webpackChunkName: "interpret" */
    '../views/interpret/InterpretScheduleView.vue'
  )
const InterpretBooth = () =>
  import(
    /* webpackChunkName: "interpret" */
    '../views/interpret/InterpretBoothView.vue'
  )

//
// Metrics
//
const Metrics = () =>
  import(
    /* webpackChunkName: "metrics" */
    '../views/metrics/AnalyseView.vue'
  )

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/atrium',
  },

  //
  // Main app
  //
  {
    path: '/atrium',
    name: Routes.Atrium,
    component: Atrium,
    meta: {
      title: 'deconf.appLayout.atrium',
    },
  },
  {
    path: '/whats-on',
    name: Routes.WhatsOn,
    component: WhatsOn,
    meta: {
      title: 'deconf.appLayout.whatsOn',
    },
  },
  {
    path: '/schedule',
    name: Routes.Schedule,
    component: Schedule,
    meta: {
      title: 'deconf.appLayout.schedule',
    },
  },
  {
    path: '/coffee',
    name: Routes.CoffeeChatLobby,
    component: CoffeeLobby,
    meta: {
      title: 'deconf.appLayout.coffeeChat',
    },
  },
  {
    path: '/help',
    name: Routes.HelpDesk,
    component: Help,
    meta: {
      title: 'deconf.appLayout.helpDesk',
    },
  },
  {
    path: '/session/:sessionId',
    name: Routes.Session,
    component: Session,
    props: true,
    meta: {
      title: 'deconf.session.title',
    },
  },

  //
  // auth
  //
  {
    path: '/login',
    name: Routes.Login,
    component: Login,
    meta: {
      title: 'deconf.login.title',
    },
  },
  {
    path: '/register',
    name: Routes.Register,
    component: Register,
    meta: {
      title: 'ifrc.register.title',
    },
  },
  {
    path: '/profile',
    name: Routes.Profile,
    component: Profile,
    meta: {
      title: 'deconf.profile.title',
    },
  },
  {
    path: '/_auth',
    name: Routes.TokenCapture,
    component: TokenCapture,
  },

  //
  // pages
  //
  {
    path: '/terms',
    name: Routes.Terms,
    component: Terms,
    meta: {
      title: 'ifrc.footer.terms',
    },
  },
  {
    path: '/privacy',
    name: Routes.Privacy,
    component: Privacy,
    meta: {
      title: 'ifrc.footer.privacy',
    },
  },
  {
    path: '/guidelines',
    name: Routes.Guidelines,
    component: Guidelines,
    meta: {
      title: 'ifrc.footer.guidelines',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'ifrc.footer.contact',
    },
  },

  //
  // Interpret
  //
  {
    path: '/interpret',
    name: Routes.InterpretHome,
    component: InterpretHome,
  },
  {
    path: '/interpret/:sessionId/:channel',
    name: Routes.InterpretSession,
    props: true,
    component: InterpretBooth,
  },

  //
  // Metrics
  //
  {
    path: '/metrics',
    name: 'Metrics',
    component: Metrics,
  },

  //
  // Errors
  //
  {
    path: '/error/:errorCode',
    props: true,
    name: Routes.Error,
    component: ApiError,
  },
  {
    path: '/error',
    component: ApiError,
  },
  {
    path: '*',
    name: Routes.NotFound,
    component: NotFound,
  },
]

const protectedRoutes = new Set<string>([
  Routes.Profile,
  // Routes.Session,
  Routes.InterpretHome,
  Routes.InterpretSession,
  Routes.HelpDesk,
  Routes.CoffeeChatLobby,
  Routes.CoffeeChatRoom,
])

function getRouteTitle(route: Route): string {
  const match = [...route.matched].reverse().find((r) => r.meta.title)

  const appName = i18n.t('ifrc.general.appName') as string

  if (match) {
    const pageName = i18n.t(match?.meta.title)
    return [pageName, appName].join(' | ')
  }

  return appName
}

// 5.25rem into pixels ($navbar-height + tabbar height)
const SCROLL_OFFSET = 80

interface PagePosition {
  x: number
  y: number
}

function scrollBehavior(
  to: Route,
  from: Route,
  savedPosition: PagePosition | void
) {
  // If they clicked on a hash, scroll to that, but under the nav bar
  if (to.hash && to.name !== Routes.TokenCapture) {
    return {
      selector: to.hash,
      offset: { x: 0, y: SCROLL_OFFSET },
    }
  }

  if (savedPosition) return savedPosition

  return { x: 0, y: 0 }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
})

router.beforeEach((to, from, next) => {
  document.title = getRouteTitle(to)

  const loggedIn = Boolean(localStorage.getItem(StorageKey.AuthToken))

  MetricsPlugin.track(createPageViewEvent(to.name ?? to.path, to.params))

  if (!loggedIn && to.name && protectedRoutes.has(to.name)) {
    next({ name: Routes.Atrium })
  } else {
    next()
  }
})

export default router
