import Vue from 'vue'
import VueRouter from 'vue-router'

import Atrium from '../views/Atrium.vue'
import Schedule from '../views/Schedule.vue'
import CoffeeChat from '../views/CoffeeChat.vue'
import Help from '../views/Help.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'

import Event from '../views/Event.vue'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import TokenCapture from '../views/TokenCapture.vue'
import Translator from '../views/Translator.vue'

import {
  ROUTE_ATRIUM,
  ROUTE_EVENT,
  ROUTE_LOGIN,
  ROUTE_TOKEN_CAPTURE,
  ROUTE_NOT_FOUND,
  ROUTE_TRANSLATOR,
  ROUTE_SCHEDULE,
  ROUTE_COFFEE_CHAT,
  ROUTE_HELP,
  ROUTE_PROFILE
} from '../const'

Vue.use(VueRouter)

const routes = [
  {
    path: '/atrium',
    name: ROUTE_ATRIUM,
    component: Atrium
  },
  {
    path: '/schedule',
    name: ROUTE_SCHEDULE,
    component: Schedule
  },
  {
    path: '/coffee',
    name: ROUTE_COFFEE_CHAT,
    component: CoffeeChat
  },
  {
    path: '/help',
    name: ROUTE_HELP,
    component: Help
  },
  {
    path: '/me',
    name: ROUTE_PROFILE,
    component: Profile
  },
  {
    path: '/prototype',
    component: Home
  },
  {
    path: '/prototype/event/:eventId',
    name: ROUTE_EVENT,
    component: Event,
    props: true
  },
  {
    path: '/login',
    name: ROUTE_LOGIN,
    component: Login
  },
  {
    path: '/_token',
    name: ROUTE_TOKEN_CAPTURE,
    component: TokenCapture
  },
  {
    path: '/not-found',
    name: ROUTE_NOT_FOUND,
    component: NotFound
  },
  {
    path: '/translator/:eventId',
    name: ROUTE_TRANSLATOR,
    component: Translator,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
