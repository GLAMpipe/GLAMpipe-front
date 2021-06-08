<template>
	<b-row>
		<b-col cols="3">
			<GPprojectSidebar/>

		</b-col>
		<b-col cols="9">


		</b-col>
	</b-row>

</template>

<script>
import GPprojectSidebar from './GPprojectSidebar.vue'
import axios from "axios"

export default {
	name: 'GPProject',
	components: {GPprojectSidebar},
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
