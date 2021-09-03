import Vue from 'vue'
import VueRouter, { /*Route,*/ RouteConfig } from 'vue-router'

// import { lib } from '@openlab/deconf-ui-toolkit'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/atrium',
  },
]

// TODO: scroll behaviour

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
