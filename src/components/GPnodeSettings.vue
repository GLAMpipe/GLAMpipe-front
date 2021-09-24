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
					<editor id="code-editor" v-model="$G.editorContent" @init="editorInit" lang="javascript" theme="twilight" width="100%" height="300"></editor>
			</setting>

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
			running: false
		}
	},

	watch: {
		'$G.current_node':function() {
			this.$G.showNodeSettings = false
			if(this.$G.current_node) {
				console.log('current node')
			}
		}
	},
	methods: {
		async initSettings() {
			if(!this.scriptInitted) {
				// fields for current collection
				var schema = await axios.get(`/api/v2/collections/${this.$route.query.collection}/schema`)
				var fields_options = schema.data.keys.map(key => '<option>' + key + '</option>')
				var fields_checkboxes = schema.data.keys.map(key => `<input class='node-settings-fields' type='checkbox' checked='checked' name='fields_${key}'/>${key}<br>`)
				$('#node-settings select.dynamic-field').append(fields_options.join('\n'))
				$('#node-settings .dynamic-field-checkboxes').append(fields_checkboxes.join('\n'))



				// fields for lookup collection
				if(this.$G.current_node.params && this.$G.current_node.params.required_source_collection) {
					var response = await axios.get(`/api/v2/collections/${this.$G.current_node.params.required_source_collection}/schema`)
					var fields = response.data.keys.map(key => '<option>' + key + '</option>')
					$('#node-settings select.lookup-dynamic-field').append(fields.join('\n'))
					$('#node-settings select.lookup-dynamic-field').append(fields.join('\n'))

				}
				if(!this.$G.current_node.settings) this.$G.current_node.settings = {}
				var settingsScript = new Function('node', '$', 'g_apipath', this.$G.current_node.scripts.ui_settings);
				settingsScript(this.$G.current_node, $, 'http://localhost:8080/api/v2');
				this.insertSettings()
				// script node
				if(this.$G.current_node.nodeid.includes("script") ) {
					if(this.$G.current_node.settings.js) this.$G.editorContent = this.$G.current_node.settings.js
					else this.$G.editorContent = "out.value = 'Hello World, id of this document is: ' + context.doc._id "
				}
				//this.scriptInitted = true
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

		editorInit(editor) {
			editor.setFontSize(16)
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
