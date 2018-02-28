import Vue from 'vue'
import axios from 'axios'
import {router} from './../../router'
import JwtDecode from 'jwt-decode'

export default {
  namespaced: true,

  state: {
    token: null,
    user: {
      id: null,
      name: ''
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.token != null
    },
    user(state) {
      return state.user
    },
    token(state){
      return state.token
    }
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      localStorage.setItem("token", payload)
    },
    recToken(state, payload){
      state.token = payload
    },
    clearToken(state) {
      state.token = null
      state.user.name = ''
      localStorage.removeItem("token")
    },
    getUser(state) {
      try{
        state.user = JwtDecode(state.token)
      } catch(e) { 
        console.log(e.message) 
      }
    }
  },
  actions: {
    loginAsk(store, payload){
      let params = new URLSearchParams()
      params.append('username', payload.username)
      params.append('password', payload.password)
      axios.post('/auth/login.php', params)
        .then(function (response) {
          store.dispatch('getToken', response.data)
          store.commit('getUser')
          store.dispatch('showMsg', response.data)
        })
    },
    regiterAsk(store, payload){
      let params = new URLSearchParams()
      params.append('username', payload.username)
      params.append('password', payload.password)
      params.append('password_again', payload.password_again)
      axios.post('/auth/register.php', params)
        .then(function (response) {
          store.dispatch('getToken', response.data)
          store.commit('getUser')
          store.dispatch('showMsg', response.data)
        })
    },
    logOut(store){
      console.log('logout-action-auth')
      store.commit('clearToken')
    },
    getToken(store, data){
      try {
        let rs = JSON.parse(data);
        if (rs.Token) {
          store.commit('setToken', rs.Token)
          router.push('/')
        }
      } catch (e) { }
    },
    recToken(store){
      let tkn = localStorage.getItem("token")
      if (tkn) { 
        store.commit('recToken', tkn)
        store.commit('getUser')
        return true
      }
      return false
    },
    showMsg(store, data) {
      try {
        let msg = JSON.parse(data);
        if (msg.reply) {
          Vue.toasted.show(msg.reply, { icon: 'check-circle', type: 'success' })
        } else if (msg.error) {
          Vue.toasted.show(msg.error, { icon: 'exclamation-triangle', type: 'error', duration: 5000 })
        } else {
          Vue.toasted.show(msg, { icon: 'info-circle', type: 'info' })
        }
      } catch (e) { }
    }
  }
};
