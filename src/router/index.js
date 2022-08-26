// INTERLOCK IS LICENSED UNDER GNU GPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import EnduserView from '../views/EnduserView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/users',
    name: 'users',
    component: HomeView
  },
  {
    path: '/groups',
    name: 'groups',
    component: HomeView
  },
  {
    path: '/dns',
    name: 'dns',
    component: HomeView
  },
  {
    path: '/gpo',
    name: 'gpo',
    component: HomeView
  },
  {
    path: '/settings',
    name: 'settings',
    component: HomeView
  },
  {
    path: '/logs',
    name: 'logs',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: LoginView
  },
  {
    path: '/enduser',
    name: 'enduser',
    component: EnduserView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
