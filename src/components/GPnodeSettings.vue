

<template>
	<div id="node-settings" ref="nodesettings">
		<b-collapse visible appear @shown="initSettingsScript" id="set" >
			<div v-html="$G.current_node.views.settings"></div>
			<b-button v-if="!$G.running_node" @click="runNode()" variant="primary">import data</b-button>
			<b-button v-if="$G.running_node == $G.current_node._id" @click="stopNode()" variant="primary">stop</b-button>

		</b-collapse>
	</div>

</template>

<script>
import axios from "axios"
import $ from 'jquery'

export default {
	name: 'GPnodeSettings',

	data() {
		return {
			showNodeSettings: true,
			scriptInitted: false,
			running: false
		}
	},

	watch: {
		'$G.current_node':function() {
			if(this.$G.current_node) {
				console.log('node settings vaihtui')
			}
		}
	},
	methods: {
		initSettingsScript() {
			if(!this.scriptInitted) {
				this.$G.current_node.settings = {}
				var settingsScript = new Function('node', '$', 'g_apipath', this.$G.current_node.scripts.ui_settings);
				settingsScript(this.$G.current_node, $, 'http://localhost:8080/api/v2');
				this.scriptInitted = true
			}

		},

		getSettings() {
			// read settings with jquery
			var settings = {};
			// read input from settings (only inputs with class "node-settings")
			$("#node-settings input.node-settings:not([type='checkbox']), #node-settings select.node-settings").each(function() {

				if($(this).attr("name")) {
					var nameSplitted = $(this).attr("name").split("[");
					// if input name has form "set[something1]", then we want to gather all of them to array
					//console.log($(this).attr("name") + ":" +  $(this).val());
					if(nameSplitted.length > 1) {
						(settings[nameSplitted[0]] || (settings[nameSplitted[0]] = [])).push($(this).val());
					} else {
						settings[$(this).attr("name")] = $(this).val();
					}
				}
			});

			// handle checkboxes separately.
			$("#node-settings  input.node-settings[type='checkbox']").each(function() {
				//if($(this).is(':checked'))
				settings[$(this).attr("name")] = $(this).is(':checked');
			});

			// handle textareas separately.
			$("#node-settings  textarea.node-settings").each(function() {
					settings[$(this).attr("name")] = $(this).val();
			});

			// script node requires sepcial handling
			//if(self.source.nodeid.includes("script") && editor) settings['js'] = editor.getValue();

			// finally read the node description
			var desc = $(".node-description-value").val();
			if(desc) settings.node_description = desc;
			return settings;
		},

		async runNode() {
			this.$G.running_node = this.$G.current_node._id
			var settings = this.getSettings()
			console.log(settings)
			var node_result = await axios.post(`/api/v2/nodes/${this.$G.running_node}/run`, settings)
			console.log(node_result)
			//this.$G.running_node = false
		},

		async stopNode() {
			this.$G.running_node = false
		}
	}
}
</script>
