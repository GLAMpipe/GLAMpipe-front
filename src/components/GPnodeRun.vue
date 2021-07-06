<style scoped>
.pointer {
  cursor: pointer;
}
</style>

<template>
	<b-card v-if="$G.current_node" header-bg-variant="info" header-text-variant="white" header="Info">
		<template #header>
			<h6 @click="showNodeSettings = !showNodeSettings" class="mb-0 pointer">
				<span><b-icon icon="caret-down"></b-icon></span>
				Settings for Node <b>{{$G.current_node.title}}</b>
		</h6>
		</template>
		<b-card-body style="padding:0.25rem" text-variant="info">
			<b-card-sub-title class="mb-2">{{$G.current_node.description}}</b-card-sub-title>
			<b-tabs v-if="showNodeSettings" content-class="mt-3" >
				<b-tab title="Settings" active>
					<GPnodeSettings></GPnodeSettings>
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
