
<style >
.pointer {
  cursor: pointer;
}

.settingtable td:first-child, .settingtable th:first-child {
   padding-left: 0px;
}

.settingtable th, .settingtable td {
   padding-left: 10px;
}


.settingslist {
	margin: 1em 0;
}

.settingslist th, .settingslist td {
	padding-left:20px;
	border-bottom:none;
}

.settingslist td:first-child, th:first-child {
	padding-left:0px;
}

setting {
	font-family: 'Open Sans', sans-serif;
	font-size: 13px;
	font-weight:300;
	color:#444;

	padding: 0px;
}


settingscontainer {
	display:block;

	margin-bottom:1px;
}

settingsheader {
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-ms-flex-align: center;
	-webkit-align-items: center;
	-webkit-box-align: center;
	height: 60px;
	padding: 0px 20px;
	cursor: pointer;
}

settingsheader:hover {
	border-left: solid rgba(52,123,255,1) 10px;
	padding-left:10px;
}

.settingstitle, h2 {
   font-size: 18px;
}

settingssubtitle {
	display: -webkit-flex;
	align-items: flex-end;
	display: flex;
	margin-left: 20px;
	padding: 20px 0px 10px 0px;
}

settingsblock {
   display: -ms-flexbox;
   display: -webkit-flex;
   -webkit-flex-direction: row;
   flex-direction: row;
   display: flex;
   flex-wrap: wrap;
}

settingsrow {
	display: -ms-flexbox;
	display: -webkit-flex;
	-webkit-flex-direction: row;
	flex-direction: row;
	display: flex;
}

submitblock {
   display: -ms-flexbox;
   display: -webkit-flex;
   display: flex;
   padding: 10px 20px 20px 20px;
}


setting {
   display: flex;
   width: 100%;
   border: 1px solid #efefef;
   margin: 7px 20px;
   padding: 10px;
   border-radius: 5px;
   justify-content: space-between;
   flex-wrap: wrap;
   max-height:600px;
   overflow: auto;
}

.one {
	flex-direction: column;
}



settingtitle {
	display:block;
	font-weight: 500;
}

settinginfo {
   flex: 1 0 300px;
}

settingaction {
   width: 300px;
   vertical-align: middle;
   flex: 1 0 300px;
}

dataheader {
   display: -ms-flexbox;
   display: -webkit-flex;
   display: flex;
   -ms-flex-align: center;
   -webkit-align-items: center;
   -webkit-box-align: center;
   height: 60px;
   padding: 0px 20px;
   justify-content: flex-end;
}


settinglistcontainer {
	display: block;
	max-height:400px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	overflow: auto;
	padding:10px;
}

settinglistcontainer input[type=checkbox] {
	width: 20px;
}

settinglistcontainer ul {
	list-style-type: none;
}

settinglistcontainer li label {
	display: inline
}

settingaction label {
	display: block
}

</style>

<style scoped>
.card-body {
	padding:0px
}
.data-header {
	margin-left:1em;
	margin-top:10px
}
</style>

<template>
	<div v-if="data && $G.current_collection">
		<div>
			<!-- <b-button v-b-toggle.sidebar-1>Toggle Sidebar</b-button> -->
			<b-sidebar id="sidebar-1" title="Debug" shadow>
				<div class="px-3 py-2">
					<p>
						store.visible: {{$store.state.visible}}
					</p>
					<p>
						$G.visible_fields: {{$G.visible_fields}}
					</p>
					<p>
						$G.user.user: {{$G.user.user}}
					</p>
					<p v-if="$store.state.running_node">
						$store.state.running_node: {{$store.state.running_node.title}}
					</p>
					<p v-if="$G.running_node">
						$G.running_node: {{$G.running_node.title}}
					</p>
				</div>
			</b-sidebar>
		</div>

		<div>

			<div class="data-header">
				<h5 class="float-left data-title"><span v-if="filter_query_badge">[Filtered]</span> Documents of {{$G.current_collection.title}} ({{data.total}})
					<b-navbar-toggle target="nav-table"><b-icon icon="gear-fill" variant="primary" title="select visible fields"></b-icon></b-navbar-toggle>
					<b-navbar-toggle target="nav-search"><b-icon icon="search" variant="primary" title="search"></b-icon></b-navbar-toggle>
				</h5>
				<b-pagination-nav v-if="data && data.total != 0" size="sm" align="right" :link-gen="linkGen" :number-of-pages="pageCount" use-router first-number last-number></b-pagination-nav>
			</div>

			<b-collapse id="nav-table" is-nav @shown="populateTabs">
				<b-container v-if="schema" class="bv-example-row mb-3">
					<b-button @click="uncheck()">uncheck all</b-button>
					<b-row cols="3">
						<template v-for="key in schema.keys"  >
							<b-col :key="key"><b-form-checkbox  v-model="selected_fields" :value="key">{{key}}</b-form-checkbox></b-col>
						</template>
					</b-row>
				</b-container>
			</b-collapse>

			<b-collapse id="nav-search" is-nav @shown="populateTabs">
					<b-row>
					<b-col v-if="schema">
						<b-form-select v-model="query_key" :options="schema.keys"></b-form-select>
					</b-col>
					<b-col>
						<b-form-select v-model="query_type" :options="query_type_list" ></b-form-select>
					</b-col>
					<b-col><b-form-input v-model="query_value"/></b-col>
					</b-row>

					<b-button @click="loadData()">Search</b-button>
			</b-collapse>


			<h5><b-badge v-if="filter_query_badge">{{filter_query_badge}} <b-icon icon="x-circle" class="pointer" @click="resetSearch()"></b-icon></b-badge></h5>

			<div v-if="data && data.total == 0 && this.query_value == ''" class="alert alert-info">No documents found from collection! <br>
				<b-icon icon="arrow-left"></b-icon> Start importing data by clicking plus sign in <b>"Read data"</b>.
			</div>

			<!-- DATA TABLE -->
			<b-table v-else small striped :no-local-sorting="true" :items="data.data" :fields="table_fields" @sort-changed="sortingChanged">
				<!--
				<template #thead-top="">
					<b-tr>
					<b-th variant="secondary">Type 1</b-th>
					<b-th variant="primary" colspan="3">Type 2</b-th>
					<b-th variant="danger">Type 3</b-th>
					</b-tr>
				</template>
			-->
				<template #head()="data">
					<span class="text-primary">{{ data.label }}</span>
				</template>

				<template #cell(action)="data">
					<div v-if="$G.showNodeSettings">
						<div v-if="$G.running_single !== data.item._id" title="Run for this document" @click="$parent.runNodeSingle(data.item._id)"><b-button variant="primary"><b-icon icon="play"/>{{data.value}}</b-button></div>
						<div v-else title="Run for this document" @click="$parent.runNodeSingle(data.item._id)"><b-button variant="primary">running...</b-button></div>
					</div>
				</template>

				<template #cell()="data">
					<div v-html="renderCell(data.value)"></div>
				</template>
			</b-table>
		</div>
	</div>

</template>

<script>

import axios from "axios"

export default {
	name: 'GPdataTable',
	data() {
		return {
			collection: '',
			current_fields: [],
			data: null,
			dataStart: 0,
			dataLimit: 15,
			filter_query_badge: '',
			initted: false,
			node_settings:{},
			pageCount: 1,
			sort: null,
			selected_fields: [],
			table_fields: [],
			query_key: '',
			query_type: '_regex_:',
			query_type_list: [{text:'is exactly', value:''}, {text:'contains', value:'_regex_:'}],
			query_value: '',
			schema: null,
			maxArrayLenghtDisplay: 10
		}
	},

	computed: {
		visible: {
			get() {
				return this.$store.state.visible
			},
			set(value) {
				console.log('setting visible')
				this.$store.dispatch('visible', value)
			}
		}
	},

	watch: {
		selected_fields() {
			this.current_fields = this.selected_fields
			axios.put(`/api/v2/user/fields`, {collection: this.$route.query.collection, fields: this.selected_fields})
		},
		current_fields() {
			this.table_fields = []
			if(this.$G.current_node && (this.$G.current_node.type == 'process' || this.$G.current_node.type == 'export')) this.table_fields.push({'key':'action', 'label':'action', 'sortable': false})
			this.table_fields = this.table_fields.concat(this.current_fields.map(key => {return {'key':key, 'label':key, 'sortable': true}}))
			console.log(this.table_fields)
			console.log(typeof this.table_fields)

			this.loadData()
		},
		async $route(from, to) {
			console.log('route vaihtui table-watch')
			console.log(from)
			console.log(to)
			// if we changed collection, we must set user fields
			if(from.query.collection != to.query.collection) this.setFields()
			this.loadData()
		},
		async "$G.current_node"() {
			if(this.$G.current_node && (this.$G.current_node.type == 'process' || this.$G.current_node.type == 'export')) this.current_fields = await this.getNodeFields(this.$G.current_node)
			else this.current_fields = this.selected_fields
		},
		"$store.state.running_node"() {
			if(!this.$G.running_node) this.loadData()
		}
	},

	methods: {
		async getNodeFields(node) {
			var fields = []
			if(node.params) {
				if(node.params.in_field) fields.push(node.params.in_field)
				if(node.params.out_field) fields.push(node.params.out_field)
				var userfields = await this.getUserFields()
				//var p = [...new Set([...fields,...userfields])]
				//console.log(p)
				return  [...new Set([...fields,...userfields])]
			}
		},
		async getUserFields() {
			await this.loadSchema()
			var fields = await this.$G.getUserFields(this.$route.query.collection)

			let filteredFields = fields.filter(el => this.schema.keys.includes(el)); // user keys must also exist in schema
			// if user fields does not exist, then create them
			if(!filteredFields || fields.length == 0) {
				fields = this.schema.keys.filter(key => this.defaultField(key) && !key.includes('__lang'))
				axios.put(`/api/v2/user/fields`, {collection: this.$route.query.collection, fields: fields})
			}
			return [...new Set(filteredFields)];
		},

		async setFields() {
			var fields = await this.getUserFields()
			this.selected_fields = fields
			this.current_fields = fields
			this.table_fields = fields.map(key => {return {'key':key, 'label':key, 'sortable': true}})
		},

		async loadData() {
			// search
			let search_query = ''
			if(this.query_value && this.query_key) {
				search_query = `&${this.query_key}=${this.query_type}${this.query_value}`
				var filter_type = this.query_type_list.find(t => t.value == this.query_type)
				this.filter_query_badge = `SEARCH: ${this.query_key} ${filter_type.text} ${this.query_value}`
			} else {
				this.filter_query_badge = ''
			}

			var sort_str = ''
			if(this.sort) sort_str = `&sort=${this.sort.sortBy}&reverse=${this.sort.sortDesc ? '1':'0'}`
			// did collection change?
			if(this.collection != this.$route.query.collection) {
				await this.loadSchema()
			}
			this.collection = this.$route.query.collection
			if(this.$route.query.page) this.dataStart = parseInt(this.$route.query.page) * this.dataLimit - this.dataLimit
			else this.dataStart = 0
			//this.getVisibleFields()
			var response = await axios(`/api/v2/collections/${this.$route.query.collection}/docs?skip=${this.dataStart}&keys=${this.current_fields.join(',')}${sort_str}${search_query}`)
			this.data = response.data
			this.pageCount = Math.ceil(this.data.total/this.dataLimit)
			if(this.pageCount === 0) this.pageCount = 1
			this.initted = true
		},

		async loadSchema() {
			var response = await axios(`/api/v2/collections/${this.$route.query.collection}/schema`)
			this.schema = response.data
		},

		renderCell(data, index, className='', key=0) {
			var html = "";
			if(data == null)
				return "<div></div>";

			// if in edit mode, then add "edit" class
			if(this.editMode)
				className += " edit";

			// render arrays recursively
			if (Array.isArray(data)) {
				for(var i = 0; i < data.length; i++) {
					//if(index === null)
					if(Array.isArray(data[i]))
						html += "<div data-index='" + i + "' class='object-cell'>["+i+"] array</div>"
					else
						html += this.renderCell(data[i], i, className, key);
				}

			// render string, numbers and nulls
			} else if (typeof data == "string" || typeof data == "number" || data === null) {
				// render urls as links
				if(typeof data == "string" && data.match(/^http/) && !this.editMode) {
					if(index === 0 || index)
						html += "<div class='"+className+"'>["+index+"] <a target='_blank' href='"+data+"'>" + data + "</a></div>";
					else
						html += "<div class='"+className+"'> <a target='_blank' href='"+data+"'>" + data + "</a></div>";
				// html img tags
				} else if(typeof data == "string" && data.match(/<img src/) && !this.editMode) {
					html = data
				// render errors
				} else if(typeof data == "string" && data.match("^AAAA_error")) {
					data = data.replace("AAAA_error:","");
					if(index != null)
						html += "<div class='error'>["+index+"] " + this.nl2br(data) + "</div>";
					else
						html += "<div class='error'>" + this.nl2br(data) + "</div>";

				} else if(typeof data == "number") {
					if(index != null)
						html += "<div class='error'>["+index+"] " + data + "</div>";
					else
						html += "<div class='error'>" + data + "</div>";


				// render strings
				} else  {
					if(index != null)
						html += "<div class='"+className+"'>["+index+"] " + this.nl2br(data, key) + "</div>";
					else
						html += "<div class='"+className+"'>" + this.nl2br(data, key) + "</div>";
				}

			// render objects
			}  else {
				if(index != null)
					html += "<div data-index="+index+" class='object-cell'>["+index+"] " + this.nl2br(JSON.stringify(data,null,2),key) + " </div>";
				else
					html += "<div class='object-cell'>" + this.nl2br(JSON.stringify(data, null, 2),key) + " ...</div>"
					html += "<div class='object-string'>as string</div>";
			}
			return html;
		},

		async populateTabs() {
				this.loadSchema()
		},

		defaultField(field) {
			if(field.includes('title')) return field
			if(field.includes('author')) return field
			if(field.includes('year')) return field
			if(field.includes('issued')) return field
			if(field.includes('date')) return field
			if(field.includes('url')) return field
			if(field.includes('pvm')) return field
			return false
		},

		async setUserFields() {
			console.log('do not update')
			//await axios.put(`/api/v2/user/fields`, {collection: this.$route.query.collection, fields: this.selected})
		},
		linkGen(pageNum) {
			return pageNum === 1 ? `?collection=${this.$route.query.collection}` : `?collection=${this.$route.query.collection}&page=${pageNum}`
		},
		uncheck() {
			this.selected_fields = ['_id']
		},
		sortingChanged(data) {
			this.sort = data
			this.loadData()
		},
		resetSearch() {
				this.query_value = ''
				this.query_key = ''
				this.loadData()
		},
		nl2br(str, keyname) {
			if(typeof str === "string") {
				if(keyname !== "thumbnail_html") {
					str = str.replace(/</g, "&lt;");
					str = str.replace(/>/g, "&gt;");
				}
				if(str.length > 1000)
					str = str.substring(0,1000) + "...<br><a class='expand' href='#'>show (not implemented)</a>\n\n";
				var breakTag = "<br />";
				return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
			} else {
				return "";
			}
		}
	},

	created: async function() {
		console.log('TABLE created')
		if(this.$route.query.collection) {
			console.log('ROUTE on')
			this.collection = this.$route.query.collection
			await this.setFields()
		}
	}
}
</script>
