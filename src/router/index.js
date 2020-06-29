import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Event from '../views/Event.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import TokenCapture from '../views/TokenCapture.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/event/:event',
    name: 'Event',
    component: Event
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/_token',
    name: 'TokenCapture',
    component: TokenCapture
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
