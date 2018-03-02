<template>
<div>
	<header class="header">
		<h1 class="h1">Simple TODO List</h1>
		<p> 
      <template v-if="user.username">
        by {{ user.username }}. <span><a href="#" @click="logOut()">  LogOut </a></span>
      </template>
    </p>
	</header>

	<transition name="slide" mode="out-in">
		<router-view></router-view>
	</transition>


</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
		return {
      loggedIn: false,
		}
	},
  computed: {
    ...mapGetters('auth', {
      user: 'user'
    }),
  },
  methods: {
    logOut: function (){
      this.user.username = ''
      this.$store.commit('todoLists/clearTodolists')
      this.$store.dispatch('auth/logOut')
      this.loggedIn = false
      this.$router.push('/login')
    },
    checkLogin () {
      if (!this.user.username && this.$route.path !== '/login') {
        this.loggedIn = false
        this.$router.push('/login')
      } else {
        this.$store.dispatch('todoLists/loadTodolists')
      }
    }
  },
  created () {
    this.loggedIn = this.$store.dispatch('auth/recToken')
    this.checkLogin()
  }
}
</script>

<style>
.slide-enter-active{
	animation: slideIn 0.5s;
}
.slide-leave-active{
	animation: slideOut 0.5s;
}
@keyframes slideIn{
	from{transform: rotateY(90deg);}
	to{transform: rotateY(0deg);}
}
@keyframes slideOut{
	from{transform: rotateY(0deg);}
	to{transform: rotateY(90deg);}
}
</style>