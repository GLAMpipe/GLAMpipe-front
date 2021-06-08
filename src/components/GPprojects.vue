<template>
	<div class="hello">
		<h1>Projects</h1>
		<b-table striped hover :items="projects" :fields="fields">
			<template #cell(title)="data">
				<b-link :to="{ path: '/projects/' + data.item._id }"> {{data.item.title}}</b-link>
			</template>
		</b-table>
  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPProjects',
	data() {
		return {
			projects: null,
			fields: [
				'title',
				'description',
				{ key: 'collection_count', label: 'collection count' }
			]
		}
	},

	methods: {
		async loadData() {
			var response = await axios("/api/v2/projects?sort=title&limit=100")
			this.projects = response.data.data
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
