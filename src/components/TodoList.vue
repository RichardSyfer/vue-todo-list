<template  >
<div>
	<div class="todo-list">
		<div class="todo-list--name" name="todo-list--name">
			<i class="todo-list--ico fa fa-list-alt"></i>
			<p class="todo-list-name"> 
				<template v-if="editStarted == false">
					{{ todoListName }}
					 <!-- - ID: {{listId}} for debugg only -->
				</template>
				<input v-show="editStarted" 
					v-model="editedListName"
					v-todoListName-focus="todoListName == editedListName"
					:class = "{ error: invalidListName }"
					@input = "invalidListName = false"
					@keyup.enter="saveListName(todoList)"
					@keyup.esc="cancelEditListName()"
					class="todo-list--description-editor" 
					type="text" 
					title="You can enter here new TODO list description">
			</p>
			<div class="todo-list--btn">
				<i @click="editListName(todoListName)"
					v-show="!editStarted"
					class="todo-list--btn-edit fa fa-pencil"></i>
				<i v-show="editStarted" 
					@click="saveListName(todoListName, todoList)"
					class="todo-list--btn-save fa fa-save"></i>
				<i @click="listRemove(listId)"
					class="todo-list--btn-delete fa fa-trash"></i>
			</div>
		</div>
		<div class="todo-list--add-new-task">
			<i class="fa fa-plus"></i>
			<input v-model="newTask"
				:class = "{ error: invalidTaskName }"
				@input = "invalidTaskName = false"
				@keyup.enter="taskInsert()"
				type="text"
				name="todo-list--add-new-task-description"
				placeholder="Start typing here to create a task... "
				maxlength="1000">
			<div @click="taskInsert()" 
					class="button todo-list--btn-add-new-task">Add Task</div>
		</div>
		<div class="todo-list--task-wrapper">
			<draggable :options="{draggable:'.item'}" @end="onEnd">
			<TodoListItem
				class="item"
				v-for="todo in todoList"
				v-if="todo.taskId"
				:key="todo.taskId"
				:todo="todo"
				@taskSave="taskSave"
				@taskRemove="taskRemove"
				@taskDone="taskCheck"
				@taskNewDeadLine="taskNewDeadLine"
			/>
			</draggable>
		</div>
	</div>
</div>
</template>

<script>
import Vue from 'vue'
import TodoListItem from './TodoListItem.vue'
import draggable from 'vuedraggable'

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
		while (k--) { arr.push(undefined) }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
}

let listRgEx = /^[\d\w\sа-яА-ЯЁё_!?@#№$%&.,'":-]{3,250}$/
let taskRgEx = /^[\d\w\sа-яА-ЯЁё_!?@#№$%&.,'":-]{3,1000}$/

export default {
	props: {
		todoList: {},
		todoListName: '',
		listId: null
	},

	data: function() {
		return {
			newTask: '',
			editedListName: '',
			editStarted: false,
			invalidListName: false,
			invalidTaskName: false,
		}
	},
	components: {
		TodoListItem,
		draggable,
	},
	methods: {
		onEnd: function (evt){
			// get new todo order and send it to DB
			let todoListClone = this.todoList.map((todo) => todo)
			let prevTaskOrder = todoListClone.map((todo) => todo.taskId)
			//make new order
			array_move(todoListClone, evt.oldIndex, evt.newIndex)
			// get new order of tasks
			let newTaskOrder = todoListClone.map((todo) => todo.taskId)
			if (!this._.isEqual(prevTaskOrder, newTaskOrder)) {
				console.log("task order changed")
				this.$emit('listOrder', {
					'todoListId': this.listId,
					'tasksPriority': newTaskOrder 
				})
			} else {
				Vue.toasted.show("Task priority not changed", { icon : 'info-circle', type: 'info'})
			}
		},
		editListName: function(listName){
				this.editStarted = true
				this.beforeEditCache = listName
				this.editedListName = listName
		},
		saveListName: function (list) {
			let editedListName = this.editedListName.trim()
			let notNum = /^[^\D]*[\D]&*[\w\d\sа-яА-ЯЁё_!?@#№$%&.,'":-]{0,250}$/

			if(this.beforeEditCache == editedListName) {
				Vue.toasted.show("List name didn't change", { icon : 'info-circle', type: 'info'})
				this.cancelEditListName()
				return
			} else  
      if(notNum.test(editedListName)){
				if(listRgEx.test(editedListName)) {
					console.log('list name valid: ' + editedListName)
					this.$emit('saveListName', { 'listId': this.listId, 'listName': editedListName })
					this.editStarted = false
					this.editedListName = ''
				} else {
					console.log('list name invalid: ' + editedListName)
					this.invalidListName = true
					let msg = `New TODO List description - invalid,
										length 3-250 symbols without some special characters` 
					Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
				}
			} else {
				console.log('list name  only numbers: '+ editedListName)
        this.invalidListName = true
				let msg = `New TODO List description - invalid, it shouldn't 
									consist only numbers and have length less 3 symbols` 
        Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
			}
		},
		listRemove: function(listId){
			let context = this
			let str = "Are you sure you want to delete this TodoList:\n" + this.todoListName
			mscConfirm("Delete", str, function(){
				context.$emit('listRemove', listId)
			})
		},
		cancelEditListName: function(listName){
			this.editStarted = false
			console.log('cancel edit list: '+this.todoListName)
			this.editedListName = ''
			this.todoListName = this.beforeEditCache
		},
		taskInsert: function(){
			let taskName = this.newTask.trim()
			if(taskRgEx.test(taskName)) {
				console.log('task name valid: ' + taskName)
				console.log('listId: ' + this.listId)

				this.$store.dispatch('todoLists/insertTask', {
					'listId': this.listId,
					'taskDesc': taskName
					})	
				this.newTask = ''
			} else {
				console.log('task name invalid: ' + taskName)
				this.invalidTaskName = true

				let msg = `TASK description - invalid,
				           it should contains 3-1000 symbols without some special characters` 
				Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
			}
		},
		taskRemove: function(task) {
			this.$store.dispatch('todoLists/deleteTask', task)
		},
		taskSave: function(task) {
			this.$store.dispatch('todoLists/updateEditedTask', task)
		},
		taskCheck: function (taskId) {
			this.$store.dispatch('todoLists/updateCheckedTask', taskId)
		},
		taskNewDeadLine: function(task) {
			this.$store.dispatch('todoLists/updateTaskDeadLine', task)
		},
	},
	directives: {
		'todoListName-focus': function (el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	}
}
</script>