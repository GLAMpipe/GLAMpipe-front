<template>
	<div class="hello">
		<b-card
			header="Create project"
			header-tag="h4"


			>
			<b-card-text>Project contains your data, transforms, downloads etc..</b-card-text>
			<b-form-input v-model="title" placeholder="project title"></b-form-input><br>
			<b-form-input v-model="description" placeholder="description (optional)"></b-form-input><br>
			<b-form-input v-model="collection" placeholder="first collection name (optional)"></b-form-input><br>
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
			title: '',
			description: '',
			collection: ''
		}
	},

	methods: {
		async createProject() {
			var response = await axios.post("/api/v2/projects", {
				title: this.title,
				description: this.description,
				collection: this.collection,
				star:'zzz'})
			console.log(response)
		}
	}
}
</script>
