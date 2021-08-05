<style scoped>
.pointer {
  cursor: pointer;
}
</style>

<template>
	<div>

		<b-card v-if="$G.current_node && $G.showNodeSettings" >
			<template #header>
				<h6 class="mb-0">

					Settings for Node <b>{{$G.current_node.title}}</b>
			</h6>
			</template>
			<b-card-body style="padding:0.25rem" text-variant="info">
				<!--<b-card-sub-title class="mb-2">{{$G.current_node.description}}</b-card-sub-title>-->


				<b-tabs  content-class="mt-3" >
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

					</b-tab>

					<b-tab title="Help" v-if="$G.current_node.views.help">
						<div v-html="$G.current_node.views.help"></div>
					</b-tab>

					<b-tab title="debug">
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

			</b-card-body>
		</b-card>
	</div>

</template>

<script>
import GPnodeSettings from './GPnodeSettings.vue'

export default {
	name: 'GPnodeRun',
	components: {GPnodeSettings},
	data() {
		return {
			showNodeSettings: false,
		}
	}
}
</script>
