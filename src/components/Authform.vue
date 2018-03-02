<template>
<div>
  <div class="todo-list--auth-form-wrapper">
    <div class="todo-list--auth-form">
    <div class="todo-list--auth-form-heading">
      <a href="#" @click="actLForm=true" :class="{ active: actLForm } " id="login-form-link">Login<i class="todo-list--auth-form-log-icon fa fa-key"></i></a>
      <a href="#" @click="actLForm=false" :class="{ active: !actLForm } " id="register-form-link">Register<i class="todo-list--auth-form-reg-icon fa fa-pencil-square-o"></i></a>
      <hr>
    </div>
    <transition name="slide" mode="out-in">
    <div v-if="actLForm" :key="1" class="todo-list--form-wrapper">
      <div class="todo-list--login-form">
        <label><b>Username</b></label>
        <input v-model="login_form.username" type="text" tabindex="1" placeholder="Enter username" autocomplete="off" minlength="4" maxlength="50" autofocus required>
        <label><b>Password</b></label>
        <input v-model="login_form.password" type="password" tabindex="2" placeholder="Enter password" minlength="6" required>
        <div class="btn-login-wrapper">
          <button  @click="login()" tabindex="4" class="button button-blue btn-login">Login</button>
        </div>
      </div>
    </div>

    <div v-else :key="2" class="todo-list--form-wrapper">
      <div class="todo-list--register-form">
        <label><b>Username</b></label>
        <input v-model="reg_form.username" type="text" tabindex="1" placeholder="Enter username" autocomplete="off" minlength="4" maxlength="50" autofocus required>
        <label><b>Password</b></label>
        <input v-model="reg_form.password" type="password" tabindex="2" placeholder="Enter new password" minlength="6" required>
        <input v-model="reg_form.password_again" type="password" tabindex="3" placeholder="Confirm new password" minlength="6" required>
        <div class="btn-register-wrapper">
          <button @click="register()" tabindex="4" class="button button-blue btn-register">Register</button>
        </div>
      </div>
      </div>
	  </transition>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      login_form: {
        username: '',
        password: '',
      },
      reg_form: {
        username: '',
        password: '',
        password_again: ''
      },
     actLForm: true,
    }
  },
  methods: {
    login() {
      this.$store.dispatch('auth/loginAsk',this.login_form)
    },
    register(){
      this.$store.dispatch('auth/regiterAsk',this.reg_form)
    }
  }
}	

</script>
<style>
.slide-enter-active{
	animation: slideIn 0.3s;
}
.slide-leave-active{
	animation: slideOut 0.3s;
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