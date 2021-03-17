<template>
	<div id="app">
		<b-navbar type="dark" variant="info">
			<b-navbar-brand href="#">GLAMpipe</b-navbar-brand>
		</b-navbar>
	

		<!-- ROUTE VIEW (main) -->
		<b-container class="bv-example-row">
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
