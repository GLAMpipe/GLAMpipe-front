<template>
	<b-row>
		<b-col cols="2">SIVUBAR
			
		</b-col>
		<b-col cols="10">
			<GPprojects/>
		</b-col>
	</b-row>

</template>

<script>
import GPprojects from './GPprojects.vue'

export default {
  name: 'GPmain',
  components: {GPprojects},
  props: {
    msg: String
  }
}
</script>
