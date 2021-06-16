<style scoped>
.pointer {
  cursor: pointer;
}
</style>

<template>
	<b-card v-if="$G.current_node" header-bg-variant="info" header-text-variant="white" header="Info">
		<template #header>
			<h6 @click="showNodeSettings = !showNodeSettings" class="mb-0 pointer">Settings for Node {{$G.current_node.title}}
			<span @click="deleteNode" class="float-right" title="delete node"><b-icon icon="trash"></b-icon></span>
		</h6>
		</template>
		<b-card-body style="padding:0.25rem" text-variant="info">
			<b-card-sub-title class="mb-2">{{$G.current_node.description}}</b-card-sub-title>
			<b-tabs v-if="showNodeSettings" content-class="mt-3" >
				<b-tab title="Settings" active>
					<GPnodeSettings></GPnodeSettings>
				</b-tab>

				<b-tab title="Parameters (read only)">
					{{$G.current_node.params}}
				</b-tab>
			</b-tabs>
		</b-card-body>
	</b-card>

</template>

<script>
import GPnodeSettings from './GPnodeSettings.vue'
import axios from "axios"
import $ from 'jquery'

export default {
	name: 'GPnodeRun',
	components: {GPnodeSettings},
	data() {
		return {
			showNodeSettings: true,
		}
	},

	watch: {
		'$G.current_node':function() {
			if(this.$G.current_node) {
				console.log('node vaihtui')


			//	var options = ['<option>kissa</option>', '<option>koira</option>']
			//	$("settingsblock select.dynamic-field").each(function() {
			//		$(this).append(options.join(""))
				//    $(this).replaceWith("<select id='" + $(this).attr("id") + "' name='" + $(this).attr("name") + "' class='dynamic-field'><option value=''>choose field</option>"+options.join("")+"</select>");
			//	})
			}

			//this.initScript()

		}
	},
	methods: {
		initScript() {
			console.log('setting script init')
			//var settingsScript = new Function('node', this.$G.current_node.scripts.ui_settings);
			var settingsScript = new Function('node', '$', this.$G.current_node.scripts.ui_settings);
			settingsScript(this.$G.current_node, $);
			/*
			console.log(`http://localhost:3333/api/v2/nodes/${this.$G.current_node._id}/scripts/ui_settings`)
			this.$loadScript(`http://localhost:3333/api/v2/nodes/${this.$G.current_node._id}/scripts/ui_settings`)
			.then(() => {
			// Script is loaded, do something
			console.log('script loaded')
			})
			.catch(() => {
			// Failed to fetch script
			console.log('ei')
			});
			*/
		},
		async deleteNode() {
			console.log(this.$G.current_node.title)
			try {
				await axios.delete(`/api/v2/nodes/${this.$G.current_node._id}`)
				this.$G.current_node = null
			} catch(e) {
				console.log(e)
			}
		}
	},

	created: function() {
			//this.loadProject();
	}
}
</script>
