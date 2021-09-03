import Vue from 'vue'
import VueRouter, { /*Route,*/ RouteConfig } from 'vue-router'

import { lib } from '@openlab/deconf-ui-toolkit'

import AtriumView from '../views/main/AtriumView.vue'
import WhatsOnView from '../views/main/WhatsOnView.vue'
import ScheduleView from '../views/main/ScheduleView.vue'
import CoffeeLobbyView from '../views/main/CoffeeLobbyView.vue'
import HelpDeskView from '../views/main/HelpDeskView.vue'

import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'

import TermsView from '../views/pages/TermsView.vue'
import PrivacyView from '../views/pages/PrivacyView.vue'
import GuidelinesView from '../views/pages/GuidelinesView.vue'

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
    name: lib.Routes.Atrium,
    component: AtriumView,
  },
  {
    path: '/whats-on',
    name: lib.Routes.WhatsOn,
    component: WhatsOnView,
  },
  {
    path: '/schedule',
    name: lib.Routes.Schedule,
    component: ScheduleView,
  },
  {
    path: '/coffee',
    name: lib.Routes.CoffeeChatLobby,
    component: CoffeeLobbyView,
  },
  {
    path: '/help',
    name: lib.Routes.HelpDesk,
    component: HelpDeskView,
  },

  //
  // auth
  //
  {
    path: '/login',
    name: lib.Routes.Login,
    component: LoginView,
  },
  {
    path: '/register',
    name: lib.Routes.Register,
    component: RegisterView,
  },

  //
  // pages
  //
  {
    path: '/terms',
    name: lib.Routes.Terms,
    component: TermsView,
  },
  {
    path: '/privacy',
    name: lib.Routes.Privacy,
    component: PrivacyView,
  },
  {
    path: '/guidelines',
    name: lib.Routes.Guidelines,
    component: GuidelinesView,
  },
]

// TODO: scroll behaviour

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
