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
		// todolists: (state) => { return state.todolists },
	},
	mutations: {
		clearTodolists(state){
			state.todolists = {}
		},
		loadTodolists(state, data){
			state.todolists = data
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
						// console.log(response.data)
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
					// console.log('ID: ' + JSON.parse(response.data).lastInsertId)

					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists') 
				})
		},
		updateEditedListName(store, list){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', list.listId)
			params.append('listName', list.listName)
			axios.post('/update.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		deleteTodoList(store, listID){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', listID)
			axios.post('/delete.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		updateTodoListOrder(store, list){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('todoListId', list.todoListId)
			params.append('tasksPriority', list.tasksPriority)
			axios.post('/update.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},

		insertTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('listId', task.listId)
			params.append('taskDesc', task.taskDesc)
			axios.post('/insert.php', params)
				.then(function (response) {
					// console.log('task inserted: '+ JSON.parse(response.data).lastInsertId)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		updateEditedTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('taskId', task.taskId)
			params.append('taskDesc', task.taskDesc)
			axios.post('/update.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		deleteTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('taskId', task.taskId)
			axios.post('/delete.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		updateCheckedTask(store, task){
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('taskId', task.taskId)
			params.append('taskDone', task.taskDone)
			axios.post('/update.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
				})
		},
		updateTaskDeadLine(store, task) {
			let params = new URLSearchParams()
			params.append('token', localStorage.getItem('token'))
			params.append('taskId', task.taskId)
			params.append('taskDeadLine', task.taskDeadLine)
			axios.post('/update.php', params)
				.then(function (response) {
					// console.log(response.data)
					store.dispatch('showMsg', response.data)
					store.dispatch('loadTodolists')
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

// function getTodoLists(){
// 	return {
// 			    "ghjghjhjghj": [
// 			        {"projId":"44","taskName":"3333333333333333","taskId":"217","taskDone":"0","taskDl":"2018-02-20 08:55:40","taskPriority":"1"},
// 			        {"projId":"44","taskName":"11111332569","taskId":"212","taskDone":"1","taskDl":"2018-02-20 08:55:40","taskPriority":"2"},
// 			        {"projId":"44","taskName":"12358792123","taskId":"213","taskDone":"0","taskDl":"2018-02-20 08:55:40","taskPriority":"3"},
// 			        {"projId":"44","taskName":"323","taskId":"214","taskDone":"0","taskDl":"2018-02-20 08:55:40","taskPriority":"4"},
// 			        {"projId":"44","taskName":"7777","taskId":"215","taskDone":"0","taskDl":"2018-02-20 08:55:40","taskPriority":"5"}
// 			        ],
// 			    "22222222222222222222":[
// 			        {"projId":"45","taskName":"222288888","taskId":"216","taskDone":"0","taskDl":"2018-02-19 16:35:05","taskPriority":"1"}
// 			        ],
// 			    "333333":[ {} ]
// 	}
// }
