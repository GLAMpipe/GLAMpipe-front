<style scoped>
settingsaction label {
	display:inline;
}
</style>

<template>
	<div id="node-settings" ref="nodesettings">
		<b-collapse visible appear @shown="initSettings" id="set" >
			<div v-html="$G.current_node.views.settings"></div>
			<setting v-if="$G.current_node.nodeid == 'process_script'">
				<settinginfo>
					<settingtitle>script editor </settingtitle>
				</settinginfo>
					<editor id="code-editor" v-model="editorContent" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="400"></editor>
			</setting>
			<template v-if="!$store.state.running_node">
				<b-button v-if="!$G.running_node && $G.current_node.type == 'source'" @click="runNode()" variant="primary"><b-icon icon="play"></b-icon> Import data</b-button>
				<b-button v-if="!$G.running_node && $G.current_node.type == 'process'" @click="runNode()" variant="primary"><b-icon icon="play"></b-icon> Run for all documents</b-button>
				<b-button v-if="!$G.running_node && $G.current_node.type == 'export'" @click="runNode()" variant="primary"><b-icon icon="play"></b-icon> Export all documents</b-button>
				<b-button v-if="!$G.running_node && $G.current_node.type == 'view'" @click="runNode()" variant="primary"><b-icon icon="play"></b-icon> Generate view</b-button>
			</template>
			<b-button v-if="$store.state.running_node && $store.state.running_node._id == $G.current_node._id" @click="stopNode()" variant="primary">stop</b-button>
			<br><br>
			<div v-if="$store.state.socket_error && $store.state.socket_error.node_uuid == $G.current_node._id" class="alert alert-warning">{{$store.state.socket_error.msg}}</div>
			<div v-if="!$store.state.socket_error  && $store.state.socket_finish && $store.state.socket_finish.node_uuid == $G.current_node._id" class="alert alert-info">{{$store.state.socket_finish.msg}}</div>

		</b-collapse>
	</div>

</template>

<script>
import axios from "axios"
import $ from 'jquery'

export default {
	name: 'GPnodeSettings',
	components: {
		editor: require('vue2-ace-editor'),
	},
	data() {
		return {
			showNodeSettings: true,
			scriptInitted: false,
			running: false,
			editorContent:""
		}
	},

	watch: {
		'$G.current_node':function() {
			if(this.$G.current_node) {
				console.log('current node')
			}
		}
	},
	methods: {
		initSettings() {
			if(!this.scriptInitted) {
				// fields for current collection
				axios.get(`/api/v2/collections/${this.$route.query.collection}/schema`).then(response => {
					var fields_options = response.data.keys.map(key => '<option>' + key + '</option>')
					var fields_checkboxes = response.data.keys.map(key => `<input class='node-settings-fields' type='checkbox' checked='checked' name='fields_${key}'/>${key}<br>`)
					$('#node-settings select.dynamic-field').append(fields_options.join('\n'))
					$('#node-settings .dynamic-field-checkboxes').append(fields_checkboxes.join('\n'))


				})
				// fields for lookup collection
				if(this.$G.current_node.params && this.$G.current_node.params.required_source_collection) {
					axios.get(`/api/v2/collections/${this.$G.current_node.params.required_source_collection}/schema`).then(response => {
						var fields = response.data.keys.map(key => '<option>' + key + '</option>')
						$('#node-settings select.lookup-dynamic-field').append(fields.join('\n'))
						$('#node-settings select.lookup-dynamic-field').append(fields.join('\n'))
					})
				}
				if(!this.$G.current_node.settings) this.$G.current_node.settings = {}
				var settingsScript = new Function('node', '$', 'g_apipath', this.$G.current_node.scripts.ui_settings);
				settingsScript(this.$G.current_node, $, 'http://localhost:8080/api/v2');
				this.insertSettings()
				// script node
				if(this.$G.current_node.nodeid.includes("script") ) {
					if(this.$G.current_node.settings.js) this.editorContent = this.$G.current_node.settings.js
					else this.editorContent = "out.value = 'Hello World, id of this document is: ' + context.doc._id "
				}
				this.scriptInitted = true
			}

		},

		insertSettings() {
			var data = {}
			data.settings = this.$G.current_node.settings
			for(var prop in this.$G.current_node.settings) {
				if(data.settings[prop] == "true" || data.settings[prop] == "false" || typeof data.settings[prop] === "boolean") {
					var checked = data.settings[prop];
					if(typeof data.settings[prop] !== "boolean")
						checked = (data.settings[prop] == 'true');

					$("input[name='"+prop+"']").prop("checked", checked);
					$("input[name='"+prop+"']").change();
				} else {
					if(Array.isArray(data.settings[prop])) {
						for(var i = 0; i < data.settings[prop].length; i++) {
							var n = i+1;
							$("input[name='"+prop+"["+n+"]']").val(data.settings[prop][i]);
						}
					// normal inputs
					} else {
						console.log("input[name='"+prop+"']")
						$("input[name='"+prop+"']").val(data.settings[prop]);
						$("select[name='"+prop+"']").val(data.settings[prop]);
						$("select[name='"+prop+"']").change();

						// textarea
						$("textarea[name='"+prop+"']").val(data.settings[prop]);
					}
				}
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
				settings[$(this).attr("name")] = $(this).is(':checked');
			});

			// handle dynamic fields checkboxes separately.
			var fields = []
			$("#node-settings  input.node-settings-fields[type='checkbox']").each(function() {
				if($(this).is(':checked')) fields.push($(this).attr("name").replace('fields_',''))
			});
			if(fields) settings.fields = fields

			// handle textareas separately.
			$("#node-settings  textarea.node-settings").each(function() {
					settings[$(this).attr("name")] = $(this).val();
			});

			// script node requires sepcial handling
			if(this.$G.current_node.nodeid.includes("script")) settings['js'] = this.editorContent;

			// finally read the node description
			var desc = $(".node-description-value").val();
			if(desc) settings.node_description = desc;
			return settings;
		},

		async runNode() {
			this.$store.commit('running_node', this.$G.current_node)
			this.$store.commit('socket_finish', '')
			this.$store.commit('socket_error', '')
			var settings = this.getSettings()
			console.log(settings)
			var node_result = await axios.post(`/api/v2/nodes/${this.$store.state.running_node._id}/start`, settings)
			console.log(node_result)
			//this.$G.running_node = false
		},

		async stopNode() {
			this.$G.running_node = false
		},
		editorInit() {
			require('brace/ext/language_tools') //language extension prerequsite...
			require('brace/mode/html')
			require('brace/mode/javascript')    //language
			require('brace/mode/less')
			//require('brace/theme/chrome')
			require('brace/theme/twilight')
			require('brace/snippets/javascript') //snippet
		}
	}
}
</script>
