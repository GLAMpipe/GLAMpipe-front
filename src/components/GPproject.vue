<style>
.sideBar {
	background-color: rgb(244, 246, 247);
}
</style>



<template>
	<b-row>
		<b-button v-show="!$G.showSideBar" @click="$G.showSideBar = !$G.showSideBar"><b-icon icon="caret-right"></b-icon></b-button>
		<b-col cols="3" v-show="$G.showSideBar" class="sideBar">
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
	methods: {
		async loadData() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.$store.commit('current_project', response.data)
		}
	},
	created: async function() {
		console.log('loading project')
		//await this.loadData();
		console.log('loading DONE')
	}
}
</script>
