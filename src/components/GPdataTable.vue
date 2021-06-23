
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
	background-color: #444;
	padding: 0px;
}


settingscontainer {
	display:block;
	background-color: rgba(255,255,255,1);
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
   background-color: #efefef;
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

settinglistcontainer label {
	display: inline
}

</style>

<template>
	<b-container fluid v-if="data && $G.current_collection">
		<div>
			<b-button v-b-toggle.sidebar-1>Toggle Sidebar</b-button>
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
					<p>
						selected_fields: {{selected_fields}}
					</p>
					<p>
						table_fields: {{table_fields}}
					</p>
				</div>
			</b-sidebar>
		</div>
		<b-navbar toggleable="m" >
			<b-navbar-brand>Documents of <i>{{$G.current_collection.title}}</i> <span>({{data.total}})</span></b-navbar-brand>
			<b-pagination-nav size="sm" align="right" :link-gen="linkGen" :number-of-pages="pageCount" use-router first-number last-number></b-pagination-nav>
			<b-navbar-toggle target="nav-table"><b-icon icon="gear-fill"></b-icon></b-navbar-toggle>

			<b-collapse id="nav-table" is-nav @shown="populateTabs">
				<b-tabs content-class="mt-3" >

					<b-tab title="Fields" active>
						<b-container v-if="schema" class="bv-example-row mb-3">
							<b-button @click="uncheck()">uncheck all</b-button>
							<b-row cols="3">
								<template v-for="key in schema.keys"  >
									<b-col :key="key"><b-form-checkbox  v-model="selected_fields" :value="key">{{key}}</b-form-checkbox></b-col>
								</template>
							</b-row>
						</b-container>
					</b-tab>

					<b-tab title="Filter">
						<b-row>
						<b-col v-if="schema">
							<b-form-select v-model="query_keys" :options="schema.keys"></b-form-select>
						</b-col>
						<b-col>
							<b-form-select v-model="query_types" :options="query_type_list"></b-form-select>
						</b-col>
						<b-col><b-form-input/></b-col>
						</b-row>
					</b-tab>
				</b-tabs>
			</b-collapse>
		</b-navbar>

		<div v-if="data && data.total == 0" class="alert alert-info">No documents found! <br>
			<b-icon icon="arrow-left"></b-icon> Start importing data by clicking plus sign in <b>"Read data"</b>.
		</div>

		<!-- DATA TABLE -->
		<b-table small striped :no-local-sorting="true" :items="data.data" :fields="table_fields" @sort-changed="sortingChanged">
			<template #cell()="data">
				<div v-html="renderCell(data.value)"></div>
			</template>
		</b-table>

	</b-container>

</template>

<script>

import axios from "axios"

export default {
	name: 'GPdataTable',
	data() {
		return {
			initted: false,
			node_settings:{},
			collection: '',
			data: null,
			schema: null,
			pageCount: 1,
			dataStart: 0,
			dataLimit: 15,
			sort: null,
			table_fields: [],
			selected_fields: [],
			query_keys: [],
			query_types: [],
			query_type_list: ['is exactly', 'contains'],
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
			this.table_fields = this.selected_fields.map(key => {return {'key':key, 'label':key, 'sortable': true}})
			axios.put(`/api/v2/user/fields`, {collection: this.$route.query.collection, fields: this.selected_fields})
			this.loadData()
		},

		async $route(from, to) {
			console.log('route vaihtui table-watch')
			console.log(from)
			console.log(to)
			// if we changed collection, we must set user fields
			if(from.query.collection != to.query.collection) this.getUserFields()
			this.loadData()
		},
		"$G.current_node"() {
			console.log(this.$G.current_node.schema)
		}
	},

	methods: {
		async getUserFields() {
			await this.loadSchema()
			var fields = this.$G.getUserFields(this.$route.query.collection)
			// if user fields does not exist, then create them
			if(!fields || fields.length == 0) {
				console.log('User fields not found')
				fields = this.schema.keys.filter(key => this.defaultField(key) && !key.includes('__lang'))
				axios.put(`/api/v2/user/fields`, {collection: this.$route.query.collection, fields: fields})
			}

			this.selected_fields = fields
			this.table_fields = fields.map(key => {return {'key':key, 'label':key, 'sortable': true}})
		},

		async loadData() {
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
			var response = await axios(`/api/v2/collections/${this.$route.query.collection}/docs?skip=${this.dataStart}&keys=${this.selected_fields.join(',')}${sort_str}`)
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
						html += "<div class='"+className+"'>["+index+"]<a target='_blank' href='"+data+"'>" + data + "</a></div>";
					else
						html += "<div class='"+className+"'><a target='_blank' href='"+data+"'>" + data + "</a></div>";

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
					html += "<div data-index="+index+" class='object-cell'>["+index+"] subdocument</div>";
				else
					html += "<div class='object-cell'>subdocument</div><div class='object-string'>as string</div>";
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
			this.selected = ['_id']
		},
		sortingChanged(data) {
			this.sort = data
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
			await this.getUserFields()
		}
	}
}
</script>
