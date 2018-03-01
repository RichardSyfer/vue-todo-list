import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from './../store'

import TodoLists from './../components/TodoLists'
import Authform from './../components/Authform'

import auth from './../store/modules/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Authform,
    beforeEnter(from, to, next) {
      store.dispatch('auth/getToken')
      if (!auth.state.token) {
        next();
      } else {
        router.push('/')
      }
    }
  },
  {
    path: '/',
    name: 'TodoLists',
    component: TodoLists,
    beforeEnter(from, to, next) {
      if (auth.state.token) {
        store.dispatch('todoLists/loadTodolists')
        next();
      } else {
        router.push('/login')
      }
    }
  }
];

export const router = new VueRouter({
  routes,
  mode: 'history'
});