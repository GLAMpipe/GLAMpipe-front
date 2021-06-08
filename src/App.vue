<template>
	<div id="app">
		<b-navbar type="dark" variant="info">
			<b-link :to="{ path: '/'}"><b-navbar-brand >GLAMpipe</b-navbar-brand></b-link>
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
