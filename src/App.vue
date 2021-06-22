<style>
.bg-info {
    background-color: #637995 !important;
}

</style>

<template>
	<div id="app">
		<b-navbar type="dark" variant="info" >

			<b-link :to="{ path: '/'}"><b-navbar-brand >GLAMpipe </b-navbar-brand></b-link>

			<b-navbar-brand v-if="$G.current_project" style="font-size:1.0rem; margin-left:20%">

				<span >
					<template v-if="showTitleEdit">
						<b-input v-model="$G.current_project.title"/>
						<b-button @click="showTitleEdit = false">cancel</b-button>
						<b-button @click="saveTitle">save</b-button>
					</template>
					<template v-else>
						<b> {{$G.current_project.title}}</b>
						<b-icon @click="showTitleEdit = true" icon="pen" style="margin-left:0.5em"></b-icon>
					</template>
				</span>
			</b-navbar-brand>
			<b-navbar-brand v-if="$G.current_project" style="font-size:1.0rem; margin-left:10px">
				<span ><i>{{$G.current_project.description}}</i></span>
				<b-icon icon="pen" style="margin-left:0.5em">></b-icon>
			</b-navbar-brand>
			<b-navbar-brand class="float-right">
				{{$store.state.user.user}}
			</b-navbar-brand>
				{{$store.state.message}}
				{{$store.state.visible}}
		</b-navbar>


		<!-- ROUTE VIEW (main) -->
		<b-container fluid style="padding:0px; margin:0px">
			<router-view class="view" v-if="!error"></router-view>
			<div class="alert alert-danger" v-if="error">{{error}}</div>
		</b-container>
  </div>
</template>

<script>
import axios from "axios"

export default {
	name: 'app',
	data: function() {
		return {
			error: null,
			user: null,
			showTitleEdit: false,
			showDescriptionEdit: false,
			logging: false
		}
	},
	created: async function() {
		var user = await axios.get('/api/v2/user')
		this.$store.commit('user', user.data)
	}
}
</script>
