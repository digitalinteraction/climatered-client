import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'

import { createPageViewEvent, Routes } from '@openlab/deconf-ui-toolkit'

import i18n from '../i18n/module'
import { StorageKey } from '../lib/constants'
import { MetricsPlugin } from '../plugins/metrics-plugin'

Vue.use(VueRouter)

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
    component: () =>
      import(
        /* webpackChunkName: "core" */
        '../views/main/AtriumView.vue'
      ),
    // meta: {
    //   title: 'ifrc.atrium.title'
    // }
  },
  {
    path: '/whats-on',
    name: Routes.WhatsOn,
    component: () =>
      import(
        /* webpackChunkName: "sessions" */
        '../views/main/WhatsOnView.vue'
      ),
    // meta: {
    //   title: 'ifrc.whatsOn.title'
    // }
  },
  {
    path: '/schedule',
    name: Routes.Schedule,
    component: () =>
      import(
        /* webpackChunkName: "sessions" */
        '../views/main/ScheduleView.vue'
      ),
    // meta: {
    //   title: 'ifrc.schedule.title'
    // }
  },
  {
    path: '/coffee',
    name: Routes.CoffeeChatLobby,
    component: () =>
      import(
        /* webpackChunkName: "coffee" */
        '../views/main/CoffeeLobbyView.vue'
      ),
    // meta: {
    //   title: 'ifrc.coffeeChat.title'
    // }
  },
  {
    path: '/help',
    name: Routes.HelpDesk,
    component: () =>
      import(
        /* webpackChunkName: "help" */
        '../views/main/HelpDeskView.vue'
      ),
    // meta: {
    //   title: 'ifrc.helpDesk.title'
    // }
  },
  {
    path: '/session/:sessionId',
    name: Routes.Session,
    component: () =>
      import(
        /* webpackChunkName: "sessions" */
        '../views/main/SessionView.vue'
      ),
    props: true,
    // meta: {
    //   title: 'ifrc.session.title'
    // }
  },

  //
  // auth
  //
  {
    path: '/login',
    name: Routes.Login,
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        '../views/auth/LoginView.vue'
      ),
    meta: {
      title: 'deconf.login.title',
    },
  },
  {
    path: '/register',
    name: Routes.Register,
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        '../views/auth/RegisterView.vue'
      ),
    meta: {
      title: 'ifrc.register.title',
    },
  },
  {
    path: '/profile',
    name: Routes.Profile,
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        '../views/auth/ProfileView.vue'
      ),
    meta: {
      title: 'deconf.profile.title',
    },
  },
  {
    path: '/_auth',
    name: Routes.TokenCapture,
    component: () =>
      import(
        /* webpackChunkName: "core" */
        '../views/auth/TokenCaptureView.vue'
      ),
  },

  //
  // pages
  //
  {
    path: '/terms',
    name: Routes.Terms,
    component: () =>
      import(
        /* webpackChunkName: "pages" */
        '../views/pages/TermsView.vue'
      ),
  },
  {
    path: '/privacy',
    name: Routes.Privacy,
    component: () =>
      import(
        /* webpackChunkName: "pages" */
        '../views/pages/PrivacyView.vue'
      ),
  },
  {
    path: '/guidelines',
    name: Routes.Guidelines,
    component: () =>
      import(
        /* webpackChunkName: "pages" */
        '../views/pages/GuidelinesView.vue'
      ),
  },
  {
    path: '/faqs',
    name: Routes.Faqs,
    component: () =>
      import(
        /* webpackChunkName: "pages" */
        '../views/pages/FaqsView.vue'
      ),
  },

  //
  // Interpret
  //
  {
    path: '/interpret',
    name: Routes.InterpretHome,
  },

  //
  // Metrics
  //
  {
    path: '/metrics',
    name: 'METRICS',
    component: () =>
      import(
        /* webpackChunkName: "metrics" */
        '../views/metrics/AnalyseView.vue'
      ),
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
