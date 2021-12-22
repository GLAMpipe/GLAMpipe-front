<style scoped>
.project-sidebar {
	background-color:white;
}

.pointer {
  cursor: pointer;
}
.active_node {
	background-color: #e4e8e3;
	border-left: solid rgba(52,123,255,1) 10px !important;;
}

.active_node .boxtitle{
	font-weight: 700
}

.bg-info {
	background:none !important;
	color:black
}
.node {
	background-color: #fbfbfb;
	border: solid rgba(213,213,213,1) 1px;
}
.card-header {
	background: none
}
.card {
	border:none
}
.card-header {
	border:none
}
.card-body {
	padding:0.6rem;
}
.navbar-toggler {
	font-size:1.0rem;
}
#node-parameters label {
	display:block;
}
h5. {
	margin-top:30px
}
.box {
	color: #444;
	border-radius: 5px;
	min-height: 50px;
	overflow: hidden;
	padding: 10px 5px 10px 10px;
	padding-left: 10px;
	margin-bottom: 10px;
	margin-right: 20px;


}
.box:hover {
	cursor: pointer;
	padding-left: 10px;
	border-left: solid rgb(169, 196, 247) 10px;
}
.boxtitle {
	font-weight: 400;
	width: 240px;
}
.description {
	font-weight: 300
}
.sub {
	border-left: solid rgba(52,123,255,1) 2px;
}

.not-collapsed {
	font-weight: 700;
}



</style>

<template>
	<b-card class="project-sidebar" v-show="showSideBar" header-tag="header" >

		<!-- // COLLECTION LIST -->
			<template #header>
				<div id="collection-nav" v-if="$G.current_project && $G.current_collection">
					<b-navbar toggleable="m" >
						<span @click="$G.showSideBar = !$G.showSideBar">
							<b-icon icon="caret-left"></b-icon>
						</span>

						<b-navbar-brand><h5>Nodes for
							<b-navbar-toggle target="nav-collapse" >{{$G.current_collection.title}} <b-icon icon="caret-down"></b-icon></b-navbar-toggle>
							<b-collapse id="nav-collapse" v-model="showCollectionChooser" is-nav>
								<b-navbar-nav class="ml-auto" >
									<b-nav-item
										v-for="collection in $G.current_project.collections"
										:key="collection.name"
										@click="setCurrentCollection(collection)">
										<li>{{collection.title}}</li>
									</b-nav-item>
								</b-navbar-nav>
								<b-link @click="showAddCollection = !showAddCollection">
									<b-icon variant="info" icon="plus-circle-fill"></b-icon>
								</b-link>
							</b-collapse>
						</h5>

						</b-navbar-brand>
					</b-navbar>
				</div>
				<!--<div v-else>
					No collections yet. <b-button @click="showAddCollection" >create collection</b-button>
				</div>-->
			</template>
			<b-card-body>



			<!-- // NODE LIST -->
			<div id="node-nav" v-if="$G.current_project">
				<div v-for="type in nodetypes" :key="type.key">
					<div style="margin-top:25px"><h5 small>{{type.label}}

						<!-- ADD NODE DIALOG -->
						<b-navbar-toggle :target="`${type.key}`">
							<b-link>
								<b-icon icon="plus-circle"></b-icon>
							</b-link>
						</b-navbar-toggle></h5>

						<b-collapse :id="`${type.key}`" :ref="`${type.key}`" is-nav style="margin-bottom:2em">
							<b-list-group>
								<b-list-group-item   v-for="(title, subtype) in verbose[type.key]" :key="title">
									<b-navbar-toggle :target="`${type.key}-${subtype}`">{{title}}</b-navbar-toggle>
									<b-collapse :id="`${type.key}-${subtype}`"  is-nav style="margin-bottom:2em" class="sub">
										<div>
											<template v-for="rnode in repository">
												<b-card v-if="rnode.type == type.key && rnode.subtype == subtype" :key="rnode._id">
													<b-link @click="current_repo_node = rnode; showAddNode = true">{{rnode.title}}</b-link>
													<p class="small">{{rnode.description}}</p>
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
						<div class="box node"  v-for="node in nodes_sorted[type.key]" :key="`${type.key}-${node._id}`" :class = "$G.current_node && $G.current_node._id == node._id?'active_node pointer':'else_class pointer'" header="Info">
							<div class="boxleft">

								<div @click="setCurrentNode(node)">

									<div v-if="node.node_description" class="title boxtitle">{{node.node_description}}</div>
									<div v-else class="title boxtitle">{{node.title}}</div>

									<div><GPNode v-bind:node="node"/></div>
									<div v-if="node.params.file">file: {{node.params.file}}</div>


									<!--
									<template v-if="$G.current_node && $G.current_node._id == node._id">
											<div v-for="(v,i) in $G.current_node.params" :key="`param${v}`">
												{{i}}:<br><b>{{v}}</b>
											</div>
									</template>
								-->
								</div>

								<div v-if="$G.current_node && $G.current_node._id == node._id">
									<div @click="setCurrentNode(node)">
										<div v-if="node.node_description" class="description">{{node.title}} </div>
										<div v-else class="description">{{node.description}} </div>
									</div>
									<b-link @click="showDeleteNode = true"><b-icon variant="danger" title="Delete node" class="float-right" icon="x-circle"></b-icon></b-link>
								</div>

							</div>
						</div>
					</template>

					<!--<template v-if="nodes_sorted">
						<b-card @click="setCurrentNode(node)" v-for="node in nodes_sorted[type.key]" :key="`${type.key}-${node._id}`" :class = "$G.current_node && $G.current_node._id == node._id?'active_node pointer':'else_class pointer'" header="Info">
							<template #header>
								<h6  class="mb-0 ">{{node.title}}</h6>
							</template>
							<b-card-body style="padding:0.25rem" text-variant="info">

								<b-card-sub-title class="mb-2">{{node.description}}</b-card-sub-title>
								<b-card-text v-if="$G.current_node && $G.current_node._id == node._id">
									<table class="table b-table">
										<tr v-for="(v,i) in $G.current_node.params" :key="`param${v}`">
											<td>{{i}}</td><td><b>{{v}}</b></td>
										</tr>
									</table>
									<b-button @click="deleteNode" variant="danger" class="float-right">delete</b-button>
								</b-card-text>
							</b-card-body>
						</b-card>
					</template>-->
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

			<!-- ADD COLLECTION MODAL -->
			<b-modal
				v-model="showDeleteNode"
				title="Delete node"
				header-bg-variant="info"
				okTitle="Delete"
				@ok="deleteNode">
				<div >
					This will delete node and ALL data it produced!
				</div>
			</b-modal>

			<!-- ADD NODE MODAL -->
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
					<b-card id="node-parameters">
						<b-card-body v-html="current_repo_node.views.params"></b-card-body>
					</b-card>
					<!--<div id="node-parameters">params... here</div>-->
				</div>
			</b-modal>

		</b-card-body>
	</b-card>
</template>

<script>
import axios from "axios"
import $ from 'jquery'
import GPNode from './GPNode.vue'

export default {
	name: 'GPProjectSidebar',
	components: {GPNode},
	data() {
		return {
			showSideBar: true,
			showAddNode: false,
			showDeleteNode: false,
			showAddCollection: false,
			showCollectionChooser: false,
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
					"file": "Read data from file",
					"web": "Read data from web",
					"collection": "Read data from collection",
					"directory": "Read data from directory"
				},
				"process": {
					"strings": "Field operations",
					"format": "Format/Map data",
					"collection": "Manage collection",
					"files": "File operations",
					"lookups": "Look up data"
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
			if(this.$route.query.collection) {
				this.getCurrentCollectionFromURL()
			} else {
				this.current_collection = null
			}
		},
		"$store.state.running_node"() {
			console.log('NODE RUN notified')
			this.loadNodes()
		}
	},


	methods: {
		async loadProject() {
			var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			this.$G.current_project = response.data
			//this.$store.commit('current_project', response.data)
			if(this.$route.query.collection) this.getCurrentCollectionFromURL() //
			//else if(this.$G.current_project.collections[0]) this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '?collection=' + this.$G.current_project.collections[0].name })
			//if(this.project.collections[0) $router.push()
		},

		async deleteNode() {
			try {
				await axios.delete(`/api/v2/nodes/${this.$G.current_node._id}`)
				this.$G.current_node = null
				this.loadNodes()
				this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '?collection=' + this.$route.query.collection + '&update=' + this.getRandomInt(10,100000)})
			} catch(e) {
				console.log(e)
			}
		},

		async loadNodes(current) {
			var response = await axios(`/api/v2/collections/${this.$route.query.collection}/nodes?limit=100`)
			console.log('nodet haettu...')
			this.nodes = response.data.nodes
			this.sortNodes()

			// we want that newly created node becomes selected node
			if(current) { // "current" is set on node creation
				this.$G.current_node = this.nodes.find(node => node._id === current)
				this.$G.showNodeSettings = true
			} else 	if(this.$G.current_node) {
				this.$G.showNodeSettings = true
				var currentNode  = this.nodes.find(node => node._id === this.$G.current_node._id)
				if(!currentNode) this.$G.current_node = null
			} else {
				this.$G.current_node = null
			}
			// combine all output fields so that they can be accessed from visible fields selector
			var outputs = []
			var inputs = []
			for(var node of this.nodes) {
				outputs = outputs.concat(node.output)
				inputs = inputs.concat(node.input)
			}
			this.$G.output_fields = outputs
			this.$G.input_fields = inputs

		},

		sortNodes() {

			// sort by node types
			this.nodes_sorted = {}
			for(var node of this.nodes) {
				if(this.nodes_sorted[node.type]) this.nodes_sorted[node.type].push(node)
				else this.nodes_sorted[node.type] = [node]

				// check that node input fields exists
				//for(var field of node.input) {

				//}
			}

		},

		async initNodeParams() {
			let removeCurrent = (collection) => collection.name !== this.$G.current_collection.name ? this.$G.current_collection.name : null
			let createOptions = (option) => `<option value="${option.name}"> ${option.title} </option>`
			var collections = this.$G.current_project.collections.filter(removeCurrent).map(createOptions)
			$('#node-parameters select.dynamic-collection').append(collections.join('\n'))
			//$('#node-parameters').append('<br><p class="alert alert-info">Tip: Node parameters can NOT be changed after the node is created</div>')
			axios.get(`/api/v2/collections/${this.$route.query.collection}/schema`).then(response => {
				var fields = response.data.keys.map(key => '<option>' + key + '</option>')
				$('#node-parameters select.dynamic-field').append(fields.join('\n'))
			})

			// set params UI script
			if(this.current_repo_node && this.current_repo_node.scripts.ui_params) {
				var settingsScript = new Function('node', '$', 'g_apipath', this.current_repo_node.scripts.ui_params);
				settingsScript(this.current_repo_node, $, 'api/v2');
			} else {
				$('#node-parameters').append('<br>DEBUG: no params script')
			}
		},

		async createNode() {
			$("#node-parameters input").each(function() {
				console.log($(this).val())
			})
			// read params with jquery
			var params = {}
			$('#node-parameters').find("input.node-params, textarea.node-params, select.node-params").each(function(){
				if($(this).attr("type") == "checkbox") {
					if($(this).is(':checked'))
						params[$(this).attr("name")] = "on";
				} else {
					params[$(this).attr("name")] = $(this).val();
				}
			})

			var node_init = {
				nodeid: this.current_repo_node.nodeid,
				project: this.$G.current_project._id,
				collection: this.$G.current_collection.name,
				params: params
			}

			try {
				// we need to create form for file import (upload)
				var node_result = null
				if(this.current_repo_node.type === 'source' && this.current_repo_node.subtype === 'file') {
					let file = document.getElementById('file').files[0]
					if(!file || !(file instanceof File)) throw('You must upload file!')
					node_init.params.file = file.name
					node_result = await axios.post('/api/v2/nodes', node_init)
					let formData = new FormData();
					formData.append('file', file)
					await axios.post(`/api/v2/nodes/${node_result.data.source._id}/upload`, formData, {headers:{'Content-Type': 'multipart/form-data'}})
				} else {
					node_result = await axios.post('/api/v2/nodes', node_init)
				}
				this.$root.$emit('bv::toggle::collapse', this.current_repo_node.type)
				this.loadNodes(node_result.data.uuid)
				//location.reload()
			} catch(e) {
				alert('Node creation failed ' + e)
			}
		},

		async createCollection() {
			var collection_init = {
				project: this.$G.current_project._id,
				title: this.new_collection
			}
			this.showCollectionChooser = false
			var col_result = await axios.post('/api/v2/collections', collection_init)
			try {
				var response = await axios(`/api/v2/projects/${this.$route.params.id}`)
			} catch(e) {
				alert('Collection creation failed! ' + e)
			}
			this.$G.current_project = response.data
			this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '?collection=' + col_result.data.id }).catch(err => {console.log(err)})
		},

		setCurrentCollection(collection) {
			if(collection) {
				//this.$G.current_collection = collection
				this.$router.replace({ path: '/projects/' + this.$G.current_project._id + '?collection=' + collection.name })
			}
			//this.loadNodes()
		},

		getCurrentCollectionFromURL() {
			var collection = null
			console.log(this.$route.query.collection)
			if(this.$route.query.collection) {
				collection = this.$G.current_project.collections.find(col => col.name == this.$route.query.collection)
			}
			this.$G.current_collection = collection
			this.loadNodes()
		},

		setCurrentNode(node) {
			console.log('setting current node to ' + node.nodeid)
			this.$G.showNodeSettings = false
			if(!this.$G.current_node) this.$G.current_node = node
			else if(this.$G.current_node && this.$G.current_node._id === node._id) this.$G.current_node = null
			else  this.$G.current_node = node
			//this.$G.current_node_fields = ['dc_contributor_author', 'dc_contributor_author_lowercase']
			//this.$emit('update:current_node', this.$G.current_node)
			//this.parseSettingsHTML()
		},

		parseSettingsHTML() {
			this.$store.current_node.views.settings = "<input id='testi'/>"
		},

		async getNodesFromRepository() {
			var response = await axios(`/api/v2/repository/nodes?limit=100`)
			this.repository = response.data.data
		},

		getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
		}

	},

	created: function() {
		this.loadProject()
		this.getNodesFromRepository()
	}
}
</script>
