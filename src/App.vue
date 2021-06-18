<style>
.bg-info {
    background-color: #637995 !important;
}
</style>
<template>
	<div id="app">
		<b-navbar type="dark" variant="info" >

			<b-link :to="{ path: '/'}"><b-navbar-brand >GLAMpipe </b-navbar-brand></b-link>

			<b-navbar-brand v-if="$G.current_project" style="font-size:1.0rem; margin-left:20%"><span ><b> {{$G.current_project.title}}</b></span></b-navbar-brand>
			<b-navbar-brand v-if="$G.current_project" style="font-size:1.0rem; margin-left:10px"><span ><i>{{$G.current_project.description}}</i></span></b-navbar-brand>

		</b-navbar>


		<!-- ROUTE VIEW (main) -->
		<b-container fluid style="padding:0px; margin:0px">
			<router-view class="view" v-if="!error"></router-view>
			<div class="alert alert-danger" v-if="error">{{error}}</div>
		</b-container>
  </div>
</template>

<script>


export default {
	name: 'app',
	data: function() {
		return {
			error: null,
			user: null,
			logging: false
		}
	}
}
</script>
