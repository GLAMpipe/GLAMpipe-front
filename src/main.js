import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSocketIO from 'vue-socket.io'
import LoadScript from 'vue-plugin-load-script';
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
		visible: [],
		user: {},
		message: ''
	},
	getters: {
		getVisibleFields: (state) => (collection) => {
			if(state.user && state.user.fields)
				return state.user.fields.find(fields => fields.collection === collection)
			else return []
		}
	},
	mutations: {
		message(state, payload) {
			this.state.message = payload
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
			console.log('data..')
			console.log(data)
			console.log('progress..')
			console.log(msg.msg)
			this.commit('message', msg.msg)
			//this.commit('increment')
		},
		"SOCKET_finish"(data, msg) {
			console.log('data..')
			console.log(data)
			console.log('progress..')
			console.log(msg.msg)
			this.commit('message', msg.msg)
			//this.commit('increment')
		},
		"visible"(data, msg) {
			console.log('set visible field')
			console.log(msg)
			this.commit('visible', msg)
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
		user: null,
		current_project: null,
		current_collection: null,
		current_node: null,
		running: [],
		showSideBar: true
	},
	methods: {

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
