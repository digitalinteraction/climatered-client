import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'

import { Routes } from '@openlab/deconf-ui-toolkit'

import AtriumView from '../views/main/AtriumView.vue'
import WhatsOnView from '../views/main/WhatsOnView.vue'
import ScheduleView from '../views/main/ScheduleView.vue'
import CoffeeLobbyView from '../views/main/CoffeeLobbyView.vue'
import HelpDeskView from '../views/main/HelpDeskView.vue'
import SessionView from '../views/main/SessionView.vue'

import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import TokenCaptureView from '../views/auth/TokenCaptureView.vue'
import ProfileView from '../views/auth/ProfileView.vue'

import TermsView from '../views/pages/TermsView.vue'
import PrivacyView from '../views/pages/PrivacyView.vue'
import GuidelinesView from '../views/pages/GuidelinesView.vue'
import FaqsView from '../views/pages/FaqsView.vue'

import i18n from '../i18n/module'
import { StorageKey } from '@/lib/constants'

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
    component: AtriumView,
    // meta: {
    //   title: 'ifrc.atrium.title'
    // }
  },
  {
    path: '/whats-on',
    name: Routes.WhatsOn,
    component: WhatsOnView,
    // meta: {
    //   title: 'ifrc.whatsOn.title'
    // }
  },
  {
    path: '/schedule',
    name: Routes.Schedule,
    component: ScheduleView,
    // meta: {
    //   title: 'ifrc.schedule.title'
    // }
  },
  {
    path: '/coffee',
    name: Routes.CoffeeChatLobby,
    component: CoffeeLobbyView,
    // meta: {
    //   title: 'ifrc.coffeeChat.title'
    // }
  },
  {
    path: '/help',
    name: Routes.HelpDesk,
    component: HelpDeskView,
    // meta: {
    //   title: 'ifrc.helpDesk.title'
    // }
  },
  {
    path: '/session/:sessionId',
    name: Routes.Session,
    component: SessionView,
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
    component: LoginView,
    meta: {
      title: 'deconf.login.title',
    },
  },
  {
    path: '/register',
    name: Routes.Register,
    component: RegisterView,
    meta: {
      title: 'ifrc.register.title',
    },
  },
  {
    path: '/profile',
    name: Routes.Profile,
    component: ProfileView,
    meta: {
      title: 'deconf.profile.title',
    },
  },
  {
    path: '/_auth',
    name: Routes.TokenCapture,
    component: TokenCaptureView,
  },

  //
  // pages
  //
  {
    path: '/terms',
    name: Routes.Terms,
    component: TermsView,
  },
  {
    path: '/privacy',
    name: Routes.Privacy,
    component: PrivacyView,
  },
  {
    path: '/guidelines',
    name: Routes.Guidelines,
    component: GuidelinesView,
  },
  {
    path: '/faqs',
    name: Routes.Faqs,
    component: FaqsView,
  },

  //
  // Interpret
  //
  {
    path: '/interpret',
    name: Routes.InterpretHome,
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

  if (!loggedIn && to.name && protectedRoutes.has(to.name)) {
    next({ name: Routes.Atrium })
  } else {
    next()
  }
})

export default router
