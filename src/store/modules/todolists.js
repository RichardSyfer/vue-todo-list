import Vue from 'vue'
import axios from 'axios'

export default {
	namespaced: true,
	state: {
		todolists: {}
	},
	getters: {
		todolists(state){
			return state.todolists
		},
		// todolists: state => state.todolists,
	},
	mutations: {
		clearTodolists(state){
			state.todolists = {}
		},
		loadTodolists(state, data){
			state.todolists = data
		},
		insertNewTodoList(state, list){
			let tmpState = _.cloneDeep(state, true)
			tmpState.todolists[list.listId] = [{ 'projName': list.projName,}]
			state.todolists = tmpState.todolists
		},
		updateEditedListName(state, list){
			state.todolists[list.listId][0].projName = list.listName
		},
		deleteTodoList(state, listId){
			let tmpState = _.cloneDeep(state, true)
			delete tmpState.todolists[listId]
			state.todolists = tmpState.todolists
		},
		insertTask(state, task){
			let listLen = state.todolists[task.listId].length
			let newTask = {
				'projName': state.todolists[task.listId][0].projName,
				'taskDl': new Date(),
				'taskDone': '0',
				'taskId': task.taskId,
				'taskName': task.taskDesc,
				'taskPriority': parseInt(state.todolists[task.listId][listLen - 1].taskPriority) + 1
			}
			let tmpState = _.cloneDeep(state, true)
			tmpState.todolists[task.listId].push(newTask)
			state.todolists = tmpState.todolists
		},
		deleteTask(state, task){
			let tmpState = _.cloneDeep(state, true)
			let index = state.todolists[task.listId].indexOf(task.task)
			if(index > 0){
				tmpState.todolists[task.listId].splice(index, 1)
			} else {
				tmpState.todolists[task.listId].splice(index, 1, { 'projName': task.task.projName})
			} 
			state.todolists = tmpState.todolists
		},
		updateTaskDeadLine(state, task){
			let tmpState = _.cloneDeep(state, true)
			let index = state.todolists[task.listId].indexOf(task.todo.prevTaskInfo)
			tmpState.todolists[task.listId][index].taskDl = new Date(task.todo.newTaskDl).toLocaleDateString()
			state.todolists = tmpState.todolists
		},
		updateCheckedTask(state, task){
			let tmpState = _.cloneDeep(state, true)
			let index = state.todolists[task.listId].indexOf(task.todo.prevTaskInfo)
			tmpState.todolists[task.listId][index].taskDone = task.todo.taskDone
			state.todolists = tmpState.todolists
		},
		updateEditedTask(state, task){
			let tmpState = _.cloneDeep(state, true)
			let index = state.todolists[task.listId].indexOf(task.todo.prevTaskInfo)
			tmpState.todolists[task.listId][index].taskName = task.todo.taskDesc
			state.todolists = tmpState.todolists
		},
},
	actions: {
		loadTodolists(store){
			axios.get('/getall.php', {
				params: {
					token: localStorage.getItem('token')
				}
			})
				.then(function (response) {
					try {
						let msg = JSON.parse(response.data);
						if (msg.error) {
							Vue.toasted.show(msg.error, {
								icon: 'exclamation-triangle',
								type: 'error',
								duration: null
							})
						} 
					} catch (e) {
						store.commit('loadTodolists', response.data)
					}
				})
		},

		insertNewTodoList(store, newTodoListName){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listName', newTodoListName)
			axios.post('/insert.php', params)
				.then(function (response) {
					try {
						let resp = JSON.parse(response.data);
						if (resp.lastInsertId) {
							let newList = { 'listId': resp.lastInsertId, 'projName': newTodoListName }
							store.commit('insertNewTodoList', newList)
						}
					} catch (e) {
						console.log(response.data)
					}
					store.dispatch('showMsg', response.data)
				})
		},
		updateEditedListName(store, list){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', list.listId)
			params.append('listName', list.listName)
			axios.post('/update.php', params)
				.then(function (response) {
					store.commit('updateEditedListName', list)
					store.dispatch('showMsg', response.data)
				})
		},
		deleteTodoList(store, listId){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', listId)
			axios.post('/delete.php', params)
				.then(function (response) {
					store.commit('deleteTodoList', listId)
					store.dispatch('showMsg', response.data)
				})
		},
		updateTodoListOrder(store, list){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('todoListId', list.todoListId)
			params.append('tasksPriority', list.tasksPriority)
			axios.post('/update.php', params)
				.then(function (response) {
					store.dispatch('showMsg', response.data)
				})
		},

		insertTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', task.listId)
			params.append('taskDesc', task.taskDesc)
			axios.post('/insert.php', params)
				.then(function (response) {
					try {
						let resp = JSON.parse(response.data);
						if (resp.lastInsertId) {
							let newTask = { 'listId': task.listId, 'taskId': resp.lastInsertId, 'taskDesc': task.taskDesc }
							store.commit('insertTask', newTask)
						}
					} catch (e) {
						console.log(response.data)
					}
					store.dispatch('showMsg', response.data)
				})
		},
		updateEditedTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', task.listId)
			params.append('taskId', task.todo.taskId)
			params.append('taskDesc', task.todo.taskDesc)
			axios.post('/update.php', params)
				.then(function (response) {
					store.commit('updateEditedTask', task)
					store.dispatch('showMsg', response.data)
				})
		},
		deleteTask(store, tsk){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('taskId', tsk.task.taskId)
			params.append('listId', tsk.listId)
			axios.post('/delete.php', params)
				.then(function (response) {
					store.commit('deleteTask', tsk)
					store.dispatch('showMsg', response.data)
				})
		},
		updateCheckedTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', task.listId)
			params.append('taskId', task.todo.taskId)
			params.append('taskDone', task.todo.taskDone)
			axios.post('/update.php', params)
				.then(function (response) {
					store.commit('updateCheckedTask', task)
					store.dispatch('showMsg', response.data)
				})
		},
		updateTaskDeadLine(store, task) {
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', task.listId)
			params.append('taskId', task.todo.taskId)
			params.append('taskDeadLine', task.todo.newTaskDl)
			axios.post('/update.php', params)
				.then(function (response) {
					store.commit('updateTaskDeadLine', task)
					store.dispatch('showMsg', response.data)
				})
		},
		showMsg(store, data) {
			let msg = JSON.parse(data);
			if(msg.reply) {
				Vue.toasted.show(msg.reply, { icon : 'check-circle', type: 'success'})
			} else if(msg.error) { 
				Vue.toasted.show(msg.error, { icon : 'exclamation-triangle', type: 'error'})
			} else {
				Vue.toasted.show(msg, { icon : 'info-circle', type: 'info'})
			}
		}
	}
};
