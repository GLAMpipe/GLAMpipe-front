<template>
	<div v-if="data">
		<b-navbar toggleable="m" >
			<b-navbar-brand href="#">Data</b-navbar-brand>

			<b-pagination-nav size="sm" align="right" :link-gen="linkGen" :number-of-pages="pageCount" use-router first-number last-number></b-pagination-nav>
			<b-navbar-toggle target="nav-table"></b-navbar-toggle>

			<b-collapse id="nav-table" is-nav @shown="populateTabs">
				<b-tabs content-class="mt-3" >
					<b-tab title="Node settings" >
						{{$G.current_node.nodeid}}
						{{$G.current_node.settings}}
					</b-tab>

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

		<highlightjs language='javascript' code="var x = 5;" />
		<b-table small striped :items="data.data" :fields="selected"></b-table>
	</div>

</template>

<script>

import axios from "axios"

export default {
	name: 'GPdataTable',
	data() {
		return {
			data: null,
			schema: null,
			pageCount: 0,
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
			console.log('loadin data' + this.selected.length)
			if(this.$route.query.page) this.dataStart = parseInt(this.$route.query.page) * this.dataLimit
			else this.dataStart = 0
			await this.getVisibleFields()
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/docs?skip=${this.dataStart}&keys=${this.selected.join(',')}`)
			this.data = response.data
			this.pageCount = Math.floor(this.data.total/this.dataLimit)
		},
		async loadSchema() {
			var response = await axios(`/api/v2/collections/${this.$route.params.collection}/schema`)
			this.schema = response.data
		},
		async populateTabs() {
				this.loadSchema()
		},
		async getVisibleFields() {
			if(this.selected.length != 0) return
			if(this.$route.query.fields) {
				this.selected =  this.$route.query.fields.split(',')
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
			//this.loadSchema()
	}
}
</script>
