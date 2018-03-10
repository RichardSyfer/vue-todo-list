<template>
  <div class="todo-list">
    <div class="todo-list--name" name="todo-list--name">
      <i class="todo-list--ico fa fa-list-alt"></i>
      <p class="todo-list-name">
        <input v-model="newTodoListName"
          :class="{ error: invalidListName }"
          @input="invalidListName = false"
          @keyup.enter="saveNewTodoList()"
          @keyup.esc="canselCreationNewTodoList()"
          type="text"
          name="todo-list--add-new-project-description" 
          placeholder="New list..."
          maxlength="250">
      </p>
      <div class="todo-list--btn">
        <i class="todo-list--btn-insert fa fa-save"
          @click="saveNewTodoList()"></i>
        <i class="todo-list--btn-remove fa fa-trash"
          @click="canselCreationNewTodoList()"></i>
      </div>
    </div>
  </div>		
</template>

<script>
import Vue from 'vue'

let listRgEx = /^[\d\w\sа-яА-ЯЁё_!?@#№$%&.,'":-]{3,250}$/

export default {
  data() {
    return {
      newTodoListName: '',
      invalidListName: false
    }
  },
  methods: {
    saveNewTodoList: function(){
      let newListName = this.newTodoListName.trim()
      let notNum = /^[^\D]*[\D]&*[\w\d\sа-яА-ЯЁё_!?@#№$%&.,'":-]{0,250}$/
      if(notNum.test(newListName)) {
        if(listRgEx.test(newListName)) {
          this.$emit('insertNewTodoList', newListName)
          this.newTodoListName = ''
        } else {
          this.invalidListName = true
          let msg = `New TODO List description - invalid,
                    length 3-250 symbols without some special characters` 
          Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
        }
      } else {
        this.invalidListName = true
        let msg = `New TODO List description - invalid, it shouldn't 
									consist only numbers and have length less 3 symbols` 
        Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
      }
    },
    canselCreationNewTodoList: function() {
      this.newTodoListName = ''
      this.$emit('removeNewTodoList')
    }
  }
}	
</script>