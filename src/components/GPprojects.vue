<style >
.dim {
	color:#8e978e;
}
</style>

<template>
	<div class="hello">
		<b-card
			header="Projects"
			header-tag="h5"
			>
			<b-card-body>

						<b-table small striped hover :items="projects" :fields="fields">
							<template #cell(title)="data">
								<b-link :to="{ path: projectURL(data.item) }"> {{data.item.title}}</b-link>
								<span class="dim"> ({{data.item.collection_count}} collections,</span>
								<span class="dim"> {{data.item.node_count}} nodes)</span>

								<div class="font-italic">{{data.item.description}}</div>
							</template>
							<template #cell(remove)="data">
								<b-icon-trash class="pointer" variant="danger" @click="openDeleteDialog(data.item)">poista</b-icon-trash>
							</template>
							<template #cell(star)="data">

								<b-icon-star v-if="data.item.star != 'yes'" class="pointer" variant="success" @click="starProject(data.item._id)"></b-icon-star>
								<b-icon-star-fill v-else variant="success" class="pointer" @click="unStarProject(data.item._id)"></b-icon-star-fill>
							</template>
						</b-table>
			</b-card-body>


		</b-card>


		<b-modal
			v-model="showDelete"
			v-if="selected_for_delete"
			@ok="deleteProject"
			okTitle="Delete"
			ok-variant="danger"
			header-bg-variant="info"
			title="Confirm delete">
			<div>
				<div class="alert alert-danger">
					<p><b-icon-trash variant="danger"></b-icon-trash> Delete <b>{{selected_for_delete.title}}</b>?</p>
					<p>Removes ALL data and nodes</p>
				</div>
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
			selected_for_delete: null,
			showDelete: false,
			fields: [
				{ key: 'star', label: 'starred' },
				{ key: 'title', label: 'title' },
				{ key: 'created', label: 'created' },
				{ key: 'remove', label: 'delete' },

			]
		}
	},

	methods: {
		projectURL(project) {
			if(project.collections && project.collections.length)
				return `/projects/${project._id}?collection=${project.collections[0].name}`
			else
				return `/projects/${project._id}`

		},
		async loadData() {
			var response = await axios("/api/v2/projects?sort=star,created&limit=100")
			this.projects = response.data.data
		},
		async starProject(id) {
			await axios.put(`/api/v2/projects/${id}`, {star:'yes'})
			this.loadData()
		},
		async unStarProject(id) {
			await axios.put(`/api/v2/projects/${id}`, {star:'zzz'})
			this.loadData()
		},
		async deleteProject() {
			await axios.delete(`/api/v2/projects/${this.selected_for_delete._id}`)
			this.selected_for_delete = null
			this.loadData()
		},
		openDeleteDialog(project) {
			this.selected_for_delete = project
			this.showDelete = !this.showDelete
		}
	},
	updated: function() {
		this.$G.current_project = null
		this.$G.current_collection = null
		this.$G.current_node = null
		this.$G.visible_fields = []
	},
	created: function() {
			this.$store.commit('current_collection', null)
			this.$store.commit('current_project', null)
			//this.$store.commit('visible', null)
			this.$G.current_project = null
			this.$G.current_collection = null
			this.$G.visible_fields = []
			this.loadData();

	}
}
</script>
