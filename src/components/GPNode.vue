<style>
.badge {
	margin:2px
}
</style>

<template>
	<div>
		<template v-if="node.settings.last_run != 0">

			<b-badge v-for="input in node.input" :key="input">
				<b-icon icon="arrow-right-square"></b-icon> {{input}}
			</b-badge>

			<b-badge variant="success" v-for="output in node.output" :key="output">
				{{output}} <b-icon icon="arrow-right-square"></b-icon>
			</b-badge>
			<div v-if="node.error == 'old input'" title="The data of this node is outdated because node's input field(s) has been re-created. " class="alert alert-danger"><b-icon   icon="exclamation-triangle-fill" variant="danger"></b-icon> Re-run me!</div>
		</template>

		<template v-else>
			<div class="alert alert-warning"><b-icon   icon="exclamation-triangle-fill" variant="danger"></b-icon> Run me from settings!</div>

		</template>

	</div>
</template>

<script>


export default {
  name: 'GPNode',
  props: {
    node: Object
  }
}
</script>
