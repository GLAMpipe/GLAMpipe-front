<template>
	<div class="hello">
		<h1>Project sidebar</h1>

  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPProjectSidebar',
	data() {
		return {
			projects: null,
			fields: ['title', { key: 'nameage', label: 'First name and age' }]
		}
	},

	methods: {
		async loadData() {
			var response = await axios("/api/v2/projects?sort=title")
			this.projects = response.data.data
		}
	},
	created: function() {
			this.loadData();
	}
}
</script>
