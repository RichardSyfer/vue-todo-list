import Vue from 'vue'
import App from './App.vue'

import {store} from './store'
import {router} from './router'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'

Vue.use(VueLodash, lodash)

import Toasted from 'vue-toasted'
Vue.use(Toasted, {
    iconPack : 'fontawesome', 
    duration: 3000,
    theme: 'bubble'
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
