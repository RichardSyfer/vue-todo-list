import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from './../store'

import TodoLists from './../components/TodoLists'
import Login from './../components/Login'
import Authform from './../components/Authform'
// import E404 from './components/E404'

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
  // {
  // 	path: '*',
  // 	component: E404
  // }

];

export const router = new VueRouter({
  routes,
  mode: 'history'
});