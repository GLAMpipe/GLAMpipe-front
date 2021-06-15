<template>
	<b-row>
		<b-col cols="3">
			<GPMainSidebar/>
		</b-col>
		<b-col cols="9">
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
