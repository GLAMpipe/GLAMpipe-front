import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSocketIO from 'vue-socket.io'
import LoadScript from 'vue-plugin-load-script';
import axios from "axios"
import App from './App.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(LoadScript)
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		connect: false,
		current_project: null,
		running_projects: null,
		current_collection: null,
		running_node: null,
		visible: [],
		user: {},
		socket_finish: {},
		socket_progress: {},
		socket_error: {}
	},
	getters: {
		getVisibleFields: (state) => (collection) => {
			if(state.user && state.user.fields)
				return state.user.fields.find(fields => fields.collection === collection)
			else return []
		}
	},
	mutations: {
		socket_finish(state, payload) {
			this.state.socket_finish = payload
		},
		socket_progress(state, payload) {
			this.state.socket_progress = payload
		},
		socket_error(state, payload) {
			this.state.socket_error = payload
		},
		current_project(state, payload) {
			this.state.current_project = payload
		},
		current_collection(state, payload) {
			this.state.current_collection = payload
		},
		current_node(state, payload) {
			this.state.current_node = payload
		},
		running_node(state, payload) {
			this.state.running_node = payload
		},
		add_running_project(state, payload) {
			this.state.running_projects.push(payload)
		},
		remove_running_project(state, payload) {
			this.state.running_projects = this.state.running_projects.filter(function(e) { return e !== payload })
		},
		user(state, payload) {
			this.state.user = payload
		},
		visible(state, payload) {
			this.state.visible = payload
		}
	},
	actions: {
		"SOCKET_connect"() {
			console.log('CONNNNNNECTING')
		},
		"SOCKET_progress"(data, msg) {
			console.log('progress data..')
			console.log(data)
			console.log('progress msg')
			console.log(msg.msg)
			this.commit('socket_progress', msg)
			//this.commit('increment')
		},
		"SOCKET_finish"(data, msg) {
			console.log('finish data')
			console.log(data)
			console.log('finish msg')
			console.log(msg.msg)
			//shared.running_node = 'dippu'
			this.commit('running_node', null)
			this.commit('socket_finish', msg)
			//this.commit('increment')
		},
		"SOCKET_error"(data, msg) {
			console.log('error data..')
			console.log(data)
			console.log('error msg')
			console.log(msg.msg)
			this.commit('socket_error', msg)
			//this.commit('increment')
		},
		"visible"(data, msg) {
			console.log('set visible field')
			console.log(msg)
			this.commit('visible', msg)
			axios.put(`/api/v2/user/fields`, {collection: this.state.current_collection, fields: this.state.visible})
		}
	}
})

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8080',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { path: "/socket.io/" } //Optional options
}))


Vue.config.productionTip = false

// 2. Define route components
import GPmain from './components/GPmain.vue'
import GPprojects from './components/GPprojects.vue'
import GPproject from './components/GPproject.vue'

// 3. Create the router
const router = new VueRouter({
  //mode: 'history',
  base: __dirname,
  routes: [
	{ path: '/', component: GPmain },
	{ path: '/projects', component: GPprojects },
	{ path: '/projects/:id', component: GPproject },
	{ path: '/projects/:id/collection/:collection', component: GPproject },
  ]
})

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// instance property https://vuejs.org/v2/cookbook/adding-instance-properties.html
var shared = new Vue({
	data:{
		api_url: '/s/converis',
		login: true ,
		error: null,
		user: {},
		current_project: null,
		current_collection: null,
		current_node: null,
		current_node_fields: [],
		visible_fields: [],
		running_single: false,
		showSideBar: true,
		showNodeSettings: false,
		editorContent:''
	},
	methods: {

		async getUserFields(collection_name) {
			var user_fields = await axios.get('/api/v2/user')
			this.user.fields = user_fields.data.fields
			if(this.user && this.user.fields) {
				var fields = this.user.fields.find(fields => fields.collection === collection_name)
				if(fields) return fields.fields
				else return null
			} else return null
		},
		updateUserFields(fields) {
			this.visible_fields = fields
			axios.put(`/api/v2/user/fields`, {collection: this.current_collection, fields: fields})
		},
		getToday() {
			var today = new Date();
			return (today.getFullYear() + '.' + ('0' + (today.getMonth()+1)).slice(-2) + '.' + ('0' + (today.getDate())).slice(-2));
		},

		renderBreaks(text, splitter) {
			if(text && typeof text === 'string') return text.split(splitter).join('<br>');
			else return '';
		}

	},
	computed: {
		c_node: function() { return this.current_node},
		local: function() {
			if(window.location.hostname == 'localhost')
				return ''
			else
				return this.api_url
		}
	}
})


shared.install = function(){
  Object.defineProperty(Vue.prototype, '$G', {
	get () { return shared }
  })
}
Vue.use(shared);


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
