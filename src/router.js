// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import EnduserView from './views/EnduserView.vue'

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
    path: '/sso-application',
    name: 'sso-application',
    component: HomeView
  },
  {
    path: '/local-users',
    name: 'local-users',
    component: HomeView
  },
  {
    path: '/local-groups',
    name: 'local-groups',
    component: HomeView
  },
  {
    path: '/ldap-dirtree',
    name: 'ldap-dirtree',
    component: HomeView
  },
  {
    path: '/ldap-users',
    name: 'ldap-users',
    component: HomeView
  },
  {
    path: '/ldap-groups',
    name: 'ldap-groups',
    component: HomeView
  },
  {
    path: '/ldap-dns',
    name: 'ldap-dns',
    component: HomeView
  },
  {
    path: '/ldap-gpo',
    name: 'ldap-gpo',
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
    path: '/debug',
    name: 'debug',
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
  },
]

export default new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    // return desired position
    return { top: 0 }
  }
})