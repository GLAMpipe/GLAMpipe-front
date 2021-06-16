
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
	<b-container fluid v-if="data">

		<b-navbar toggleable="m" >
			<b-navbar-brand>Documents of <i>{{$G.current_collection.title}}</i> <span>({{data.total}})</span></b-navbar-brand>

			<b-pagination-nav size="sm" align="right" :link-gen="linkGen" :number-of-pages="pageCount" use-router first-number last-number></b-pagination-nav>
			<b-navbar-toggle target="nav-table"></b-navbar-toggle>

			<b-collapse id="nav-table" is-nav @shown="populateTabs">
				<b-tabs content-class="mt-3" >

					<b-tab title="Fields" active>
						<b-container v-if="schema" class="bv-example-row mb-3">
							<b-button @click="selected = []">uncheck all</b-button>
							<b-row cols="5">
								<template v-for="key in schema.keys"  >
									<b-col :key="key"><b-form-checkbox  v-model="selected" :value="key">{{key}}</b-form-checkbox></b-col>
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

		<!-- DATA TABLE -->
		<b-table small striped :items="data.data" :fields="selected"></b-table>

	</b-container>

</template>

<script>

import axios from "axios"

export default {
	name: 'GPdataTable',
	data() {
		return {
			node_settings:{},
			collection: '',
			data: null,
			schema: null,
			pageCount: 1,
			dataStart: 0,
			dataLimit: 15,
			selected: [],
			fields: [],
			query_keys: [],
			query_types: [],
			query_type_list: ['is exactly', 'contains']
		}
	},

	watch: {
		selected() {
			this.$router.replace({path: this.$router.currentRoute.path, query: {page: this.$route.query.page, fields: this.selected.join(',')}})
			this.setUserFields()

		},
		$route() {
			if(this.$route.params.collection) {
				this.loadData()
			} else {
				this.current = null
			}
		}
	},

	methods: {
		async loadData() {
			if(this.collection != this.$route.params.collection) await this.loadSchema()
			this.collection = this.$route.params.collection
			console.log('loadin data' + this.selected.length)
			if(this.$route.query.page) this.dataStart = parseInt(this.$route.query.page) * this.dataLimit
			else this.dataStart = 0
			await this.getVisibleFields()
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/docs?skip=${this.dataStart}&keys=${this.selected.join(',')}`)
			this.data = response.data
			this.pageCount = Math.floor(this.data.total/this.dataLimit)
			if(this.pageCount === 0) this.pageCount = 1
		},
		async loadSchema() {
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/schema`)
			this.schema = response.data
		},
		async populateTabs() {
				this.loadSchema()
		},
		async getVisibleFields() {
			if(this.$route.query.fields) {
				var routefields = this.$route.query.fields.split(',')
				this.selected =  routefields.filter(key => this.schema.keys.includes(key)) // key must be in schema
			} else {
				var fields = this.schema.keys.filter(key => key != '_id' && key != '__gp_source')
				this.selected = fields.slice(0,5)
			}
		},
		async setUserFields() {
			await axios.put(`/api/v2/user/fields`, {collection: this.$route.params.collection, fields: this.selected})
		},
		linkGen(pageNum) {
			return pageNum === 1 ? '?' : `?page=${pageNum}`
		}
	},

	created: function() {
			this.loadData();

			//$(document).on('click', 'setting input', function(){console.log($(this).val())});
			//this.loadSchema()
	}
}
</script>
