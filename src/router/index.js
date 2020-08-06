import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '../i18n'

import Atrium from '../views/Atrium.vue'
import Sessions from '../views/Sessions.vue'
import Schedule from '../views/Schedule.vue'
import CoffeeChat from '../views/CoffeeChat.vue'
import Help from '../views/Help.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import Terms from '../views/Terms.vue'
import Privacy from '../views/Privacy.vue'

import Event from '../views/Event.vue'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import TokenCapture from '../views/TokenCapture.vue'
import Translator from '../views/Translator.vue'

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
  ROUTE_PRIVACY,
  ROUTE_SESSIONS
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'is-active'
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
