import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Event from '../views/Event.vue'
import Login from '../views/Login.vue'
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
