<style scoped>
.pointer {
  cursor: pointer;
}
.active_node {
	background-color: #e4e8e3;

}
.bg-info {
	background:none !important;
	color:black
}
.card {
	margin-top: 20px;
	margin-bottom: 20px;
}
.card-body {
	padding:0.6rem;
}
.navbar-toggler {
	font-size:1.0rem;
}


</style>

<template>
	<div class="project-sidebar" v-show="showSideBar">

		<!-- // COLLECTION LIST -->
		<div id="collection-nav" v-if="$G.current_project && $G.current_collection">
			<b-navbar toggleable="m" >
				<span @click="$G.showSideBar = !$G.showSideBar">
					<b-icon icon="caret-left"></b-icon>
				</span>

				<b-navbar-brand>Nodes for
					<b-navbar-toggle target="nav-collapse" >{{$G.current_collection.title}} <b-icon icon="caret-down"></b-icon></b-navbar-toggle>
					<b-collapse id="nav-collapse" is-nav>
						<b-navbar-nav class="ml-auto" >
							<b-nav-item
								v-for="collection in $G.current_project.collections"
								:key="collection.name"
								@click="$router.push({ path: '/projects/' + $G.current_project._id + '/collection/' + collection.name })">
								<b-badge>{{collection.title}}</b-badge>
							</b-nav-item>
						</b-navbar-nav>
						<b-link @click="showAddCollection = !showAddCollection">
							<b-icon variant="info" icon="plus-circle-fill"></b-icon>
						</b-link>
					</b-collapse>

				</b-navbar-brand>


			</b-navbar>
		</div>
		<div v-else>
			No collections yet. <b-button @click="showAddCollection" >create collection</b-button>
		</div>


		<!-- // NODE LIST -->
		<div id="node-nav" v-if="$G.current_project">
			<div v-for="type in nodetypes" :key="type.key">
				<div style="margin-top:15px"><h6 small>{{type.label}}

					<!-- ADD NODE DIALOG -->
					<b-navbar-toggle :target="`${type.key}`">
						<b-link>
							<b-icon icon="plus-circle"></b-icon>
						</b-link>
					</b-navbar-toggle></h6>

					<b-collapse :id="`${type.key}`"  is-nav style="margin-bottom:2em">
						<b-list-group>
							<b-list-group-item   v-for="(title, subtype) in verbose[type.key]" :key="title">
								<b-navbar-toggle :target="`${type.key}-${subtype}`">{{title}}</b-navbar-toggle>
								<b-collapse :id="`${type.key}-${subtype}`"  is-nav style="margin-bottom:2em">
									<div>
										<template v-for="rnode in repository">
											<b-card v-if="rnode.type == type.key && rnode.subtype == subtype" :key="rnode._id">
												<b-link @click="current_repo_node = rnode; showAddNode = true">{{rnode.title}}</b-link>
												<p>{{rnode.description}}</p>
											</b-card>
										</template>
									</div>
								</b-collapse>
							</b-list-group-item>
						</b-list-group>
					</b-collapse>
				</div>

				<!-- LIST OF EXISTING NODES -->
				<template v-if="nodes_sorted">
					<b-card @click="setCurrentNode(node)" v-for="node in nodes_sorted[type.key]" :key="`${type.key}-${node._id}`" :class = "$G.current_node && $G.current_node._id == node._id?'active_node pointer':'else_class pointer'" header="Info">
						<template #header>
							<h6  class="mb-0 ">{{node.title}}</h6>
						</template>
						<b-card-body style="padding:0.25rem" text-variant="info">
							<!--<b-card-title>{{node.title}}</b-card-title>-->
							<b-card-sub-title class="mb-2">{{node.description}}</b-card-sub-title>
							<b-card-text>

							</b-card-text>
						</b-card-body>
					</b-card>
				</template>
			</div>
		</div>

		<!-- ADD COLLECTION MODAL -->
		<b-modal
			v-model="showAddCollection"
			title="Add collection"
			header-bg-variant="info"
			okTitle="Create"
			@ok="createCollection">
			<div >
				<b-input placeholder="collection title" v-model="new_collection"/>
			</div>
		</b-modal>

		<!-- ADD NODED MODAL -->
		<b-modal
			v-if="current_repo_node"
			v-model="showAddNode"
			@shown="initNodeParams"
			:title="current_repo_node.title"
			header-bg-variant="info"
			okTitle="Create node"
			@ok="createNode">
			<div >
				<p>{{current_repo_node.description}}</p>
				<h5>Node parameters</h5>
				<div id="node-parameters" v-html="current_repo_node.views.params"></div>
				<!--<div id="node-parameters">params... here</div>-->
			</div>
		</b-modal>

  </div>
</template>

<script>
import axios from "axios"
import $ from 'jquery'

export default {
	name: 'GPProjectSidebar',
	data() {
		return {
			showSideBar: true,
			showAddNode: false,
			showAddCollection: false,
			new_collection: '',
			initAddNode: false,
			nodes: null,
			current_node: null,
			current_subtype: null,
			current_repo_node: null,
			params_html: '',
			nodes_sorted: null,
			repository: [],
			nodetypes: [
				{key:'source', label:'Read data'},
				{key:'process', label:'Process the data'},
				{key:'export', label:'Write the data'},
				{key:'view', label:'View the data'}
			],
			subtypes: {},
			verbose: {
				"source": {
					"collection": "Read data from collection",
					"web": "Read data from web",
					"file": "Read data from file"
				},
				"process": {
					"strings": "String operations",
					"documents": "Modify whole records",
					"format": "Format/Map data",
					"collection": "Manage collection",
					"files": "File operations",
					"lookups": "Look up data",
					"pipe": "Series of operations",
				},
				"export": {
					"file": "Export data to file",
					"web": "Export data to web"
				},
				"view": {
					"data": "View data"
				}
			}
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
		async initNodeParams() {
			let removeCurrent = (collection) => collection.name !== this.$G.current_collection.name ? this.$G.current_collection.name : null
			let createOptions = (option) => '<option>' + option.title + '</option>'
			var collections = this.$G.current_project.collections.filter(removeCurrent).map(createOptions)
			$('#node-parameters select.dynamic-collection').append(collections.join('\n'))
		},

		async loadProject() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.$G.current_project = response.data
			if(this.$route.params.collection) this.setCurrentCollection() //
			else if(this.$G.current_project.collections[0]) this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '/collection/' + this.$G.current_project.collections[0].name })
			//if(this.project.collections[0) $router.push()
		},

		async loadNodes() {
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/nodes`)
			this.nodes = response.data.nodes
			this.sortNodes()

		},

		async createNode() {
			$("#node-parameters input").each(function() {
				console.log($(this).val())
			})
			var node_init = {
				nodeid: this.current_repo_node.nodeid,
				project: this.$G.current_project._id,
				collection: this.$G.current_collection.name,
				params: {}
			}
			var node_result = await axios.post('/api/v2/nodes', node_init)
			console.log(node_result)

			// we need to create form for file import (upload)
			if(this.current_repo_node.type === 'source' && this.current_repo_node.subtype === 'file') {
				let file = document.getElementById('file').files[0]
				let formData = new FormData();
				formData.append('file', file)
				var result = await axios.post(`/api/v2/nodes/${node_result.data.source._id}/upload`, formData, {headers:{'Content-Type': 'multipart/form-data'}})
				console.log(result)
			}

			//let formData = new FormData();
			console.log(this.current_repo_node.title)

		},

		async createCollection() {
			var collection_init = {
				project: this.$G.current_project._id,
				title: this.new_collection
			}
			var col_result = await axios.post('/api/v2/collections', collection_init)
			console.log(col_result)
			this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '/collection/' + col_result.data.id })
		},

		sortNodes() {
			this.nodes_sorted = {}
			for(var node of this.nodes) {
				if(this.nodes_sorted[node.type]) this.nodes_sorted[node.type].push(node)
				else this.nodes_sorted[node.type] = [node]
			}
		},

		setCurrentCollection() {
			var collection = this.$G.current_project.collections.find(col => col.name == this.$route.params.collection)
			if(!this.$G.current_collection) {
				this.$G.current_collection = collection
				this.loadNodes()
			}
			if(this.$G.current_collection && this.$G.current_collection.name != collection.name) {
				this.$G.current_collection = collection
				this.loadNodes()
			}
		},

		setCurrentNode(node) {
			if(!this.$G.current_node) this.$G.current_node = node
			else if(this.$G.current_node && this.$G.current_node._id === node._id) this.$G.current_node = null
			else  this.$G.current_node = node
			//this.$emit('update:current_node', this.$G.current_node)
			//this.parseSettingsHTML()
		},
		parseSettingsHTML() {
			this.$G.current_node.views.settings = "<input id='testi'/>"
		},
		async getNodesFromRepository() {
			var response = await axios(`/api/v2/repository/nodes`)
			this.repository = response.data.data


		}
	},

	created: function() {
			this.loadProject();
			this.getNodesFromRepository()
	}
}
</script>
