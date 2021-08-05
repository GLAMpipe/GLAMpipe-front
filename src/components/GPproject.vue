<style>

</style>



<template>
	<b-row>
		<b-button v-show="!$G.showSideBar" @click="$G.showSideBar = !$G.showSideBar"><b-icon icon="caret-right"></b-icon></b-button>
		<b-col cols="3" v-show="$G.showSideBar" class="sideBar">
			<b-container fluid style="padding-left:0px; background-color:#EFEFEF">
				<GPprojectSidebar />
			</b-container>
		</b-col>

		<b-col cols="9">
			<GPnodeRun />
			<GPdataTable/>
		</b-col>
	</b-row>

</template>

<script>
import GPprojectSidebar from './GPprojectSidebar.vue'
import GPnodeRun from './GPnodeRun.vue'
import GPdataTable from './GPdataTable.vue'
import axios from "axios"
import $ from 'jquery'

export default {
	name: 'GPProject',
	components: {GPprojectSidebar, GPdataTable, GPnodeRun},
	methods: {
		async loadData() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.$store.commit('current_project', response.data)
		},
		getSettingsFromUI() {
			// read settings with jquery
			var settings = {};
			// read input from settings (only inputs with class "node-settings")
			$("#node-settings input.node-settings:not([type='checkbox']), #node-settings select.node-settings").each(function() {

				if($(this).attr("name")) {
					var nameSplitted = $(this).attr("name").split("[");
					// if input name has form "set[something1]", then we want to gather all of them to array
					//console.log($(this).attr("name") + ":" +  $(this).val());
					if(nameSplitted.length > 1) {
						(settings[nameSplitted[0]] || (settings[nameSplitted[0]] = [])).push($(this).val());
					} else {
						settings[$(this).attr("name")] = $(this).val();
					}
				}
			});

			// handle checkboxes separately.
			$("#node-settings  input.node-settings[type='checkbox']").each(function() {
				settings[$(this).attr("name")] = $(this).is(':checked');
			});

			// handle dynamic fields checkboxes separately.
			var fields = []
			$("#node-settings  input.node-settings-fields[type='checkbox']").each(function() {
				if($(this).is(':checked')) fields.push($(this).attr("name").replace('fields_',''))
			});
			if(fields.length) settings.fields = fields

			// handle textareas separately.
			$("#node-settings  textarea.node-settings").each(function() {
					settings[$(this).attr("name")] = $(this).val();
			});

			// script node requires sepcial handling
			if(this.$G.current_node.nodeid.includes("script")) settings['js'] = this.$G.editorContent;

			// finally read the node description
			var desc = $(".node-description-value").val();
			if(desc) settings.node_description = desc;
			return settings;
		},

		async runNode() {
			this.$store.commit('running_node', this.$G.current_node)
			this.$store.commit('socket_finish', '')
			this.$store.commit('socket_error', '')
			var settings = this.getSettingsFromUI()
			console.log(settings)
			var node_result = await axios.post(`/api/v2/nodes/${this.$store.state.running_node._id}/start`, settings)
			console.log(node_result)
			//this.$G.running_node = false
		},

		async stopNode() {
			this.$G.running_node = false
		},
		async runNodeSingle(id) {
			console.log('runNodeSingle')
			this.$store.commit('running_node', this.$G.current_node)
			var settings = this.getSettingsFromUI()
			this.$G.running_single = id
			await axios.post(`/api/v2/nodes/${this.$G.current_node._id}/run/${id}`, settings)
			console.log(settings)
			this.$G.running_single = false
			this.$store.commit('running_node', null)

		}
	},
	created: async function() {
		console.log('loading project')
		//await this.loadData();
		console.log('loading DONE')
	}
}
</script>
