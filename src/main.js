import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import App from './App.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false

// 2. Define route components
import GPmain from './components/GPmain.vue'
import GPprojects from './components/GPprojects.vue'

// 3. Create the router
const router = new VueRouter({
  //mode: 'history',
  base: __dirname,
  routes: [
	{ path: '/', component: GPmain },
	{ path: '/projects', component: GPprojects },
  ]
})

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
