<style scoped>

</style>

<template>
	<div class="hello">

		<!-- // COLLECTION LIST -->
		<div id="collection-nav" v-if="project && current_collection">
			<b-navbar toggleable="m" >
				<b-navbar-brand href="#">{{project.title}} > {{current_collection.title}}</b-navbar-brand>

				<b-navbar-toggle target="nav-collapse" ></b-navbar-toggle>

				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="ml-auto" v-for="(collection, index) in project.collections" :key="index">
						<b-nav-item @click="$router.push({ path: '/projects/' + project._id + '/collection/' + collection.name })">{{collection.title}}</b-nav-item>
					</b-navbar-nav>
				</b-collapse>
			</b-navbar>
		</div>
		<div v-else>
			No collections yet. <b-button>create collection</b-button>
		</div>


		<!-- // NODE LIST -->
		<div id="node-nav" v-if="project && nodes_sorted">
			<div v-for="type in nodetypes" :key="type">
				{{type.label}}
				<b-card v-for="(node, index) in nodes_sorted[type.key]" :key="`${type.key}-${index}`" header="Info">
					<template #header>
						<h5 class="mb-0">{{node.title}}</h5>
					</template>
					<b-card-body>
						<!--<b-card-title>{{node.title}}</b-card-title>-->
						<b-card-sub-title class="mb-2">{{node.description}}</b-card-sub-title>
						<b-card-text>

						</b-card-text>
					</b-card-body>

				</b-card>
			</div>
		</div>
  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'GPProjectSidebar',
	data() {
		return {
			project: null,
			nodes: null,
			nodes_sorted: null,
			nodetypes: [
				{key:'source', label:'Read data'},
				{key:'process', label:'Process the data'},
				{key:'export', label:'Write the data'},
				{key:'view', label:'View the data'}
			],
			fields: ['title', { key: 'nameage', label: 'First name and age' }]
		}
	},

	watch: {
		$route() {
			if(this.$route.params.collection) {
				this.setCurrentCollection()
			} else {
				this.current = null
			}
		}
	},

	methods: {
		async loadProject() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.project = response.data
			if(this.$route.params.collection) this.setCurrentCollection() //
			else if(this.project.collections[0]) this.$router.push({ path: '/projects/' + this.project._id + '/collection/' + this.project.collections[0].name })
			//if(this.project.collections[0) $router.push()
		},
		async loadNodes() {
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/nodes`)
			this.nodes = response.data.nodes
			this.sortNodes()

		},
		sortNodes() {
			this.nodes_sorted = {}
			for(var node of this.nodes) {
				if(this.nodes_sorted[node.type]) this.nodes_sorted[node.type].push(node)
				else this.nodes_sorted[node.type] = [node]
			}
		},
		setCurrentCollection() {
			this.current_collection = this.project.collections.find(col => col.name == this.$route.params.collection)
			this.loadNodes()
		}
	},

	created: function() {
			this.loadProject();
	}
}
</script>
