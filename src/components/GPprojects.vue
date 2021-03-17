<template>
	<div class="hello">
		<h1>Projects</h1>
		<b-table striped hover :items="projects" :fields="fields">
			<template #cell(nameage)="data">
				button {{data.item._id}}
			</template>
		</b-table>
  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPprojects',
	data() {
		return {
			projects: null,
			fields: ['title', { key: 'nameage', label: 'First name and age' }]
		}
	},

	methods: {
		async loadData() {
			var response = await axios("/api/v2/projects?sort=title")
			this.projects = response.data
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
