import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);
import "highlight.js/styles/github.css"


import App from './App.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(hljsVuePlugin)

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
		current_node: null,
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
  render: h => h(App),
}).$mount('#app')
