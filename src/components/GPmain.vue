<template>
	<b-row>
		<b-col cols="4">
			<GPMainSidebar/>

		</b-col>
		<b-col cols="8">
			<GPProjects/>
		</b-col>
	</b-row>

</template>

<script>
import GPProjects from './GPprojects.vue'
import GPMainSidebar from './GPmainSidebar.vue'

export default {
  name: 'GPMain',
  components: {GPProjects, GPMainSidebar},
  props: {
    msg: String
  }
}
</script>
