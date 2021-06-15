
<template>
	<b-row>
		<b-button v-show="!$G.showSideBar" @click="$G.showSideBar = !$G.showSideBar">></b-button>
		<b-col cols="3" v-show="$G.showSideBar">
			<GPprojectSidebar :current_collection.sync="c_collection" />
		</b-col>

		<b-col cols="9">

			<GPnodeSettings />
			<GPdataTable/>
		</b-col>
	</b-row>

</template>

<script>
import GPprojectSidebar from './GPprojectSidebar.vue'
import GPnodeSettings from './GPnodeSettings.vue'
import GPdataTable from './GPdataTable.vue'
import axios from "axios"

export default {
	name: 'GPProject',
	components: {GPprojectSidebar, GPdataTable, GPnodeSettings},
	data() {
		return {
			project: null,
			c_collection: null,
			c_node: null,
			fields: [
				'title',
				'description',
				{ key: 'collection_count', label: 'collection count' }
			]
		}
	},

	methods: {
		async loadData() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.project = response.data
			this.$G.current_project = this.project
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
