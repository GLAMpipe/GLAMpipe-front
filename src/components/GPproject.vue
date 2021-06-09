<template>
	<b-row>
		<b-button v-show="!$G.showSideBar" @click="$G.showSideBar = !$G.showSideBar">></b-button>
		<b-col cols="3" v-show="$G.showSideBar">
			<GPprojectSidebar/>
		</b-col>

		<b-col cols="9">
			<GPdataTable/>
		</b-col>
	</b-row>

</template>

<script>
import GPprojectSidebar from './GPprojectSidebar.vue'
import GPdataTable from './GPdataTable.vue'
import axios from "axios"

export default {
	name: 'GPProject',
	components: {GPprojectSidebar, GPdataTable},
	data() {
		return {
			project: null,
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
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
