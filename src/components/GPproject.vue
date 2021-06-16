
<template>
	<b-row>
		<b-button v-show="!$G.showSideBar" @click="$G.showSideBar = !$G.showSideBar"><b-icon icon="caret-right"></b-icon></b-button>
		<b-col cols="3" v-show="$G.showSideBar">
			<b-container fluid>
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

export default {
	name: 'GPProject',
	components: {GPprojectSidebar, GPdataTable, GPnodeRun},
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
			this.$G.current_node = null
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
