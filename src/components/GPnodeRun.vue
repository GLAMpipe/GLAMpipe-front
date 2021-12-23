<style scoped>
.pointer {
  cursor: pointer;
}
.card-header {
	background-color: white;
	border-left: solid rgba(52,123,255,1) 10px;
}
.card {
	border: none
}
.card-body {
	padding:0px
}
.pointer {
  cursor: pointer;
}
.tabbi {
	background-color: #ffffff;
}
.settings-body {
	background-color: #e4e8e3
}
</style>

<template>
	<div>

		<b-card v-if="$G.current_node"  >
			<template #header>

				<h6 class="mb-0 pointer" @click="$G.showNodeSettings = !$G.showNodeSettings" >
					<b-link >
						<b-icon v-if="!$G.showNodeSettings" icon="caret-down"></b-icon>
						<b-icon v-if="$G.showNodeSettings" icon="caret-up"></b-icon>
					</b-link>
					Settings for Node <b>{{$G.current_node.title}}</b>

			</h6>
			</template>

			<b-card-body v-if="$G.showNodeSettings" text-variant="info">
				<!--<b-card-sub-title class="mb-2">{{$G.current_node.description}}</b-card-sub-title>-->


				<b-tabs  content-class="mt-3 tabbi" class="card-header" @activate-tab="initTab">
					<b-tab title="Settings"  active>
						<GPnodeSettings ></GPnodeSettings>
						<br>
						<div v-if="$G.current_node.error" class="alert "><b-icon   icon="exclamation-triangle-fill" variant="danger"></b-icon> {{$G.current_node.error}}</div>
						<template v-if="!$store.state.running_node">
							<b-button v-if="!$G.running_node && $G.current_node.type == 'source'" @click="$parent.runNode()" variant="primary"><b-icon icon="play"></b-icon> Import data</b-button>
							<b-button v-if="!$G.running_node && $G.current_node.type == 'process'" @click="$parent.runNode()" variant="primary"><b-icon icon="play"></b-icon> Run for all documents</b-button>
							<b-button v-if="!$G.running_node && $G.current_node.type == 'export'" @click="$parent.runNode()" variant="primary"><b-icon icon="play"></b-icon> Export all documents</b-button>
							<b-button v-if="!$G.running_node && $G.current_node.type == 'view'" @click="$parent.runNode()" variant="primary"><b-icon icon="play"></b-icon> Generate view</b-button>
						</template>
						<b-button v-if="$store.state.running_node && $store.state.running_node._id == $G.current_node._id" @click="stopNode()" variant="primary">stop</b-button>
						<br><br>
						<div v-if="$store.state.socket_error && $store.state.socket_error.node_uuid == $G.current_node._id" class="alert alert-warning">{{$store.state.socket_error.msg}}</div>
						<div v-if="!$store.state.socket_error  && $store.state.socket_finish && $store.state.socket_finish.node_uuid == $G.current_node._id" class="alert alert-info">{{$store.state.socket_finish.msg}}</div>
						<div v-if="!$store.state.socket_error  && $store.state.socket_progress && $store.state.socket_progress.node_uuid == $G.current_node._id" class="alert alert-info">{{$store.state.socket_progress.msg}}</div>


					</b-tab>

					<b-tab title="Help" v-if="$G.current_node.views.help">
						<div v-html="$G.current_node.views.help"></div>
					</b-tab>

					<b-tab title="Description" >
						<textarea cols="100" v-model="$G.current_node.description"></textarea><br>
						<b-button @click="saveNodeDescription()">Save</b-button>
					</b-tab>
<!--
					<b-tab title="Before JS">
						<editor id="code-editor" v-model="$G.current_node.scripts.init" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>Init script is called only start of the node excution. <br>Init can set execution time variables (context.VARIABLENAME) and core.login when needed.</div>
						<br>
						<b-button @click="saveScript('init')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('init')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>
-->
					<b-tab title="Options JS" v-if="$G.current_node.scripts.options">
						<div>Options script is called once for every document before process.js. It should set core.options.</div>
						<editor id="code-editor" v-model="$G.current_node.scripts.options" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<br>
						<b-button @click="saveScript('options')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('options')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>

					<b-tab title="Processing JS">
						<div>Processing script is called once for every document.</div>
						<editor id="code-editor" v-model="$G.current_node.scripts.process" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<br>
						<b-button @click="saveScript('process')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('process')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>
<!--
					<b-tab title="After JS">
						<editor id="code-editor" v-model="$G.current_node.scripts.finish" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>After script is called once in the end of node execution.</div>
						<br>
						<b-button @click="saveScript('finish')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('finish')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>
-->


					<b-tab title="debug">
						<h5>params</h5>
						<table class="table b-table">
							<tr v-for="(val,i) in $G.current_node.params" :key="`set${val}`">
								<td><b>{{i}}</b></td><td>{{val}}</td>
							</tr>
						</table>
						<h5>settings</h5>
						<table class="table b-table">
							<tr v-for="(val,i) in $G.current_node.settings" :key="`set${val}`">
								<template v-if="i == 'last_run'"><td><b>{{i}}</b></td><td>{{getLastRun(val)}}</td></template>
								<template v-else><td><b>{{i}}</b></td><td>{{val}}</td></template>
							</tr>
						</table>


						<a target="_blank" :href="`http://localhost:3000/api/v2/nodes/${$G.current_node._id}`">API</a><br>
						<br>
						<b-button @click="$store.commit('running_node', $G.current_node)">debug run</b-button>
						<b-button @click="$store.commit('running_node', null)">debug stop</b-button>
					</b-tab>

				</b-tabs>
				<div v-if="info" class="alert alert-info">{{info}}</div>
			</b-card-body>
		</b-card>
	</div>

</template>

<script>
import GPnodeSettings from './GPnodeSettings.vue'
import axios from "axios"

export default {
	name: 'GPnodeRun',
	components: {
		GPnodeSettings,
		editor: require('vue2-ace-editor')
	},
	data() {
		return {
			showNodeSettings: false,
			info: ''
		}
	},
	methods: {
		getLastRun(stamp) {
				var date = new Date(stamp)
				return date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
		},
		async saveNodeDescription() {
			try {
				var update = {description: this.$G.current_node.description}
				await axios.post(`/api/v2/nodes/${this.$G.current_node._id}/settings/description`, update)
			} catch(e) {
				this.info = 'Description saved'
			}
		},
		async saveScript(scriptname) {
			try {
				await axios.put(`/api/v2/nodes/${this.$G.current_node._id}/scripts/${scriptname}`, {js:this.$G.current_node.scripts[scriptname]})
				this.info = 'Saved!'
			} catch(e) {
				this.info = 'Save failed ' + e
			}
		},
		async revertScript(scriptname) {
			try {
				var result = await axios.put(`/api/v2/nodes/${this.$G.current_node._id}/scripts/${scriptname}/revert`)
				this.$G.current_node.scripts[scriptname] = result.data
				this.info = "Reverted!"
			} catch(e) {
				this.info = "Revert failed"
			}
		},

		initTab() {
			this.info = ''
		},
		editorInit(editor) {
			this.info = ''
			editor.setFontSize(16)
			require('brace/ext/language_tools') //language extension prerequsite...
			require('brace/mode/html')
			require('brace/mode/javascript')    //language
			require('brace/mode/less')
			//require('brace/theme/chrome')
			require('brace/theme/twilight')
			require('brace/snippets/javascript') //snippet
		}
	}
}
</script>
