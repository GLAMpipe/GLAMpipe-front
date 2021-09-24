<style scoped>
.pointer {
  cursor: pointer;
}
.card-header {
	background-color: #cbd2ea;
	border-left: solid rgba(52,123,255,1) 10px;
}
.card {
	border: none
}
</style>

<template>
	<div>

		<b-card v-if="$G.current_node"  >
			<template #header>

				<h6 class="mb-0">
					<b-link @click="$G.showNodeSettings = !$G.showNodeSettings" >
						<b-icon v-if="!$G.showNodeSettings" icon="caret-down"></b-icon>
						<b-icon v-if="$G.showNodeSettings" icon="caret-up"></b-icon>
					</b-link>
					Settings for Node <b>{{$G.current_node.title}}</b>

			</h6>
			</template>

			<b-card-body v-if="$G.showNodeSettings" style="padding:0.25rem" text-variant="info">
				<!--<b-card-sub-title class="mb-2">{{$G.current_node.description}}</b-card-sub-title>-->


				<b-tabs  content-class="mt-3" @activate-tab="initTab">
					<b-tab title="Settings" active>
						<GPnodeSettings></GPnodeSettings>
						<br>
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

					<b-tab title="Before JS">
						<editor id="code-editor" v-model="$G.current_node.scripts.init" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>Init.js is called only start of the node excution. <br>Init.js can set execution time variables (context.VARIABLENAME) and core.login when needed.</div>
						<br>
						<b-button @click="saveScript('init')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('init')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>

					<b-tab title="options.js" v-if="$G.current_node.scripts.options">
						<editor id="code-editor" v-model="$G.current_node.scripts.options" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>Options.js is called once for every document before process.js. It should set core.options.</div>
						<br>
						<b-button @click="saveScript('options')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('options')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>

					<b-tab title="Processing JS">
						<editor id="code-editor" v-model="$G.current_node.scripts.process" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>Process.js is called once for every document.</div>
						<br>
						<b-button @click="saveScript('process')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('process')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>

					<b-tab title="After JS">
						<editor id="code-editor" v-model="$G.current_node.scripts.finish" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
						<div>Finish.js is called once in the end of node execution.</div>
						<br>
						<b-button @click="saveScript('finish')" variant="primary" title="Save your own version of script">Save</b-button>
						<b-button @click="revertScript('finish')" title="Revert script to its original form" class="float-right">Revert</b-button>
					</b-tab>

					<b-tab title="delete">
						<b-button  variant="danger" @click="deleteNode">
							<b-icon  icon="x-circle" title="Remove node">delete</b-icon>
							Delete this node!
						</b-button>
					</b-tab>

					<b-tab title="debug">
						<h5>params</h5>
						<table class="table b-table">
							<tr v-for="(val,i) in $G.current_node.params" :key="`set${val}`">
								<td>{{i}}</td><td><b>{{val}}</b></td>
							</tr>
						</table>
						<h5>settings</h5>
						<table class="table b-table">
							<tr v-for="(val,i) in $G.current_node.settings" :key="`set${val}`">
								<td>{{i}}</td><td><b>{{val}}</b></td>
							</tr>
						</table>


						<a target="_blank" :href="`http://localhost:3333/api/v2/nodes/${$G.current_node._id}`">API</a><br>
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
		async deleteNode() {
			try {
				await axios.delete(`/api/v2/nodes/${this.$G.current_node._id}`)
				this.$G.current_node = null
				this.loadNodes()
				//location.reload()
			} catch(e) {
				console.log(e)
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
