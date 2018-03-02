import Vue from 'vue'
import Router from 'vue-router'
import Guard from '../services/middleware'

import TodoLists from './../components/TodoLists'
import Authform from './../components/Authform'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'Login', component: Authform, beforeEnter: Guard.guest },
    { path: '/', name: 'TodoLists', component: TodoLists, beforeEnter: Guard.auth  },
  ]
})