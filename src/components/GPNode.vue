<style>
.badge {
	margin:2px
}
.alert-warn {
	border-left: solid rgba(255,0,0,1) 10px !important;
}
</style>

<template>
	<div>
		<div v-if="node.error == 'old input'" title="The data of this node is outdated because node's input field(s) has been re-created. " class="alert "><b-icon   icon="exclamation-triangle-fill" variant="danger"></b-icon> Old input, re-run me!</div>
		<div v-else-if="node.error" class="alert "><b-icon   icon="exclamation-triangle-fill" variant="danger"></b-icon> {{node.error}}</div>
		<template v-if="node.settings">

			<b-badge v-for="input in node.input" :key="input">
				<b-icon icon="arrow-right-square"></b-icon> {{input}}
			</b-badge>

			<b-badge variant="success" v-for="output in node.output" :key="output">
				{{output}} <b-icon icon="arrow-right-square"></b-icon>
			</b-badge>
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
