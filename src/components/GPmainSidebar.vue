<template>
	<div class="hello">
		<b-card
			header="Create project"
			header-tag="header"

			title="Title"
			>
			<b-card-text>Project contains your data, transforms, downloads etc..</b-card-text>
			<b-form-input v-model="new_project"></b-form-input>
			<b-button href="#" variant="primary" @click="createProject">Create project</b-button>
		</b-card>

  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPMainSidebar',
	data() {
		return {
			new_project: '',
			fields: ['title', { key: 'nameage', label: 'First name and age' }]
		}
	},

	methods: {
		async createProject() {
			var response = await axios.post("/api/v2/projects", {title: this.new_project})
			console.log(response)
		}
	}
}
</script>
