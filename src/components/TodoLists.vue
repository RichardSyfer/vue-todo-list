<template>
<div>

	<template v-for="(todoList, todoListName) in todoLists">
		<TodoList :todoList="todoList" 
			:todoListName="todoListName"
			:listId="todoList[0].projId"
			:key="todoList[0].projId"
			@saveListName="saveListName"
			@listRemove="listRemove"
			@listOrder="listOrder"/>
	</template>

	<NewProjectItem v-show="addNewTodoList"
		@removeNewTodoList="removeNewTodoList"
		@insertNewTodoList="insertNewTodoList"/>
	<div class="todo-list--btn-add-wrapper">
		<div class="button button-blue todo-list--btn-add"
			@click="addTodoList()">
			<i class="fa fa-plus"></i> Add TODO list
		</div>
	</div>

</div>
</template>

<script>
import TodoList from './TodoList'
import NewProjectItem from './NewProjectItem'

import {mapGetters} from 'vuex'

export default {
	components: {
		TodoList,
		NewProjectItem,
	},
	data() {
		return {
			addNewTodoList: false,
		}
	},
	computed: {
		...mapGetters('todoLists', {
			todoLists: 'todolists'
		}),
	},
	methods:{
		addTodoList: function(){
			this.addNewTodoList = true
		},
		insertNewTodoList: function(newTodoListName){
			this.$store.dispatch('todoLists/insertNewTodoList', newTodoListName)
			this.addNewTodoList = false 
		},
		removeNewTodoList: function(){
			this.addNewTodoList = false
		},
		saveListName: function(list){
			this.$store.dispatch('todoLists/updateEditedListName', list)
		},
		listRemove: function(listId){
			this.$store.dispatch('todoLists/deleteTodoList', listId)
		},
		listOrder: function(list){
			this.$store.dispatch('todoLists/updateTodoListOrder', list)
		}
	}
}
</script>

<style>
</style>