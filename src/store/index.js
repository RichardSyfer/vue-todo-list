import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

axios.defaults.baseURL = 'http://vue-todo-list/backend/functions'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.use(Vuex)

import todoLists from './modules/todolists'
import auth from './modules/auth'

export const store = new Vuex.Store({
	modules: {
		todoLists,
		auth
	},
	strict: process.env.NODE_ENV !== 'production'
})