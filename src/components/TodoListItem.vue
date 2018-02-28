<template>
		<div :class="{'task-done': todo.taskDone == 1}"
			@mouseover="taskBtnsActive = true"
			@mouseleave="taskBtnsActive = false"
			class="todo-list--task">

			<div class="todo-list--task-chkbx-done">
				<input :checked="todo.taskDone == 1"
					@click="checkTask(todo.taskId, $event)"
					type="checkbox" name="todo-list--task-chkbx-done">
			</div>
			<div :class="{done: todo.taskDone == 1}"
				class="todo-list--task-description"
				name="todo-list--task-description">

				<template v-if="editedTodo == null">
				<p> {{ todo.taskName }} </p>
				<p class="todo-list--task-deadline"> 
					Deadline at: 
					<span v-show="!datepic.show">{{ new Date(todo.taskDl).toLocaleDateString() }}</span>
					<datepicker v-show="datepic.show"
						v-model="datepic.taskDeadLine"
						:placeholder="datepic.placeholderString"
						:format="datepic.dateFormat"
						language="ru"
						@closed="saveNewDeadLine(todo)"
					></datepicker>
				</p>
				</template>
				
				<input v-show="editedTodo != null" 
					v-model="newTodoName"
					v-todo-focus="todo == editedTodo"
					:class="{ error: invalidTaskName}"
					@input="invalidTaskName = false"
					@keyup.enter="saveTask(todo)"
					@keyup.esc="cancelEditTask(todo)"
					class="todo-list--task-description-editor" 
					type="text" 
					title="You can enter here new task description">
			</div>

			<div class="todo-list--task-btns-wrapper">
				<div class="todo-list--task-btns"
					:class=" {active: taskBtnsActive} ">
					
					<i v-show="!datepic.show"
						@click="editTaskDeadline(todo)"
						class="todo-list--task-btn-dt fa fa-calendar"></i>
					<i v-show="datepic.show"
						@click="saveNewDeadLine(todo)"
						class="todo-list--task-btn-save-dline fa fa-save"></i>
					<i v-show="editedTodo == null"
						@click="editTask(todo)" 
						class="todo-list--task-btn-edit fa fa-pencil"></i>
					<i v-show="editedTodo" 
						@click="saveTask(todo)"
						class="todo-list--task-btn-save fa fa-save"></i>
					<i @click="removeTask(todo)"
						class="todo-list--task-btn-delete fa fa-trash"></i>
				</div>
			</div>
		</div>
</template>

<script>
import Vue from 'vue'
import Datepicker from 'vuejs-datepicker'

let taskRgEx = /^[\d\w\sа-яА-ЯЁё_!?@#№$%&.,'":]{3,1000}$/

export default {
	props: {
		todo: {}
	},
	components: { Datepicker },
	data() {
		return {
			newTodoName: '',
			editedTodo: null,
			invalidTaskName: false,
			taskBtnsActive: false,
			datepic: {
				taskDeadLine: null,
				dateFormat: 'dd.MM.yyyy',
				placeholderString: '',
				show: false,
			},
		}
	},
	methods: {
		editTask: function (todo) {
			this.beforeEditCache = todo.taskName
			this.editedTodo = todo
			this.newTodoName = todo.taskName
		},
		saveTask: function (todo) {
			let newTaskName = this.newTodoName.trim()
			
			if(this.beforeEditCache == newTaskName){
				let msg = "TASK description didn't change"
				Vue.toasted.show(msg, { icon : 'info-circle', type: 'info'})
				this.cancelEditTask(todo)
				return
			} else 		

			if(taskRgEx.test(newTaskName)) {
				console.log('new task name valid: ' + newTaskName)
				console.log({'taskId': todo.taskId, 'taskDesc': newTaskName })
				this.$emit('taskSave', {'taskId': todo.taskId, 'taskDesc': newTaskName })
				this.newTodoName = ''
				this.editedTodo = null
			} else {
				console.log('task name invalid: ' + newTaskName)
				this.invalidTaskName = true
				let msg = `TASK description - invalid,
				           it should contains 3-1000 symbols without some special characters` 
				Vue.toasted.show(msg, { icon : 'exclamation-triangle', type: 'error', duration: 4000})
			}
		},
		removeTask: function (todo) {
			let context = this
			let str = "Are you sure you want to delete this task:\n" + todo.taskName
			mscConfirm("Delete", str, function(){
				context.$emit('taskRemove', todo)
			})
		},
		cancelEditTask: function (todo) {
			this.editedTodo = null
			todo.taskName = this.beforeEditCache
		},
		checkTask: function(taskID, e) {
			if(e.target.checked){
				this.$emit('taskDone', { 'taskId': taskID, 'taskDone': 1 })
			} else {
				this.$emit('taskDone', { 'taskId': taskID, 'taskDone': 0 })
			}
		},
		saveNewDeadLine: function(todo) {
			this.datepic.show = false
			let newTaskDl = new Date(this.datepic.taskDeadLine).toLocaleDateString()
			if(this.beforeEditCache != newTaskDl) {
				this.$emit('taskNewDeadLine', { 'taskId': todo.taskId, 'taskDeadLine': newTaskDl })
			} else {
				Vue.toasted.show("Date not changed", { icon : 'info-circle', type: 'info'})
			}
		},
		editTaskDeadline: function(todo){
			this.datepic.show = true
			let localFormatDate = new Date(todo.taskDl).toLocaleDateString()
			this.beforeEditCache = localFormatDate
			this.datepic.taskDeadLine = todo.taskDl
		}
	},
	directives: {
		'todo-focus': function (el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	}
}	
</script>