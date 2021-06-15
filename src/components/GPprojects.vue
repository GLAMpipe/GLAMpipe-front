<template>
	<div class="hello">
		<h1 class="h2">Projects</h1>
		<b-table small striped hover :items="projects" :fields="fields">
			<template #cell(title)="data">
				<b-link :to="{ path: '/projects/' + data.item._id }"> {{data.item.title}}</b-link>
			</template>
			<template #cell(remove)="data">
				<b-icon-trash variant="danger" @click="openDeleteDialog(data.item)">poista</b-icon-trash>
			</template>
			<template #cell(star)="data">

				<b-icon-star v-if="data.item.star != 'yes'" variant="success" @click="starProject(data.item._id)"></b-icon-star>
				<b-icon-star-fill v-else variant="success" @click="unStarProject(data.item._id)"></b-icon-star-fill>
			</template>
		</b-table>
		<b-modal v-model="showDelete">
			<div v-if="selected">
				Delete {{selected.title}}?
				<b-icon-trash variant="danger" @click="deleteProject(selected._id)"></b-icon-trash>
			</div>
		</b-modal>
  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPProjects',
	data() {
		return {
			projects: null,
			selected: null,
			showDelete: false,
			fields: [
				'star',
				'title',
				'description',
				{ key: 'collection_count', label: 'collection count' },
				'remove'
			]
		}
	},

	methods: {
		async loadData() {
			var response = await axios("/api/v2/projects?sort=star,title&limit=100")
			this.projects = response.data.data
		},
		async starProject(id) {
			await axios.put(`/api/v2/projects/${id}`, {star:'yes'})
			this.loadData()
		},
		async unStarProject(id) {
			await axios.put(`/api/v2/projects/${id}`, {star:'yy'})
			this.loadData()
		},
		async deleteProject(id) {
			await axios.delete(`/api/v2/projects/${id}`)
			this.loadData()
		},
		openDeleteDialog(id) {
				this.selected = id
				this.showDelete = !this.showDelete
		}
	},
	created: function() {
			this.loadData();
			this.$G.current_project = null
	}
}
</script>
