import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from './../store'

import TodoLists from './../components/TodoLists'
import Authform from './../components/Authform'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Authform
  },
  {
    path: '/',
    name: 'TodoLists',
    component: TodoLists,
    beforeEnter(from, to, next) {
      store.dispatch('todoLists/loadTodolists');
      next();
    }
  },
];

export const router = new VueRouter({
  routes,
  mode: 'history'
});