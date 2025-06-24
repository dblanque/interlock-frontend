<template>
	<div class="ma-0 pa-0" :style="getStyle()">
		<v-progress-linear :loading="loading" v-if="showLoading"></v-progress-linear>
		<v-list :dense="dense" :disabled="disabled">
			<v-list-item-group multiple v-model="selected">
				<v-list-item v-for="(item, index) in userChoices"
					:key="item[usernameKey]" :value="item.id" @change="updateSelected(item)">
					<template v-slot:default="{ active }">
						<v-list-item-avatar class="my-0 pa-0">
							<v-icon v-if="!active">
								mdi-checkbox-blank-outline
							</v-icon>
							<v-icon v-else color="primary">
								mdi-checkbox-marked
							</v-icon>
						</v-list-item-avatar>

						<v-list-item-content class="ma-0 pa-0">
							<v-list-item-title>
								{{ getName(item) }}
							</v-list-item-title>
						</v-list-item-content>
						<v-list-item-action></v-list-item-action>
					</template>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</div>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	data() {
		return {
			loading: true,
			error: false,
			selected: []
		}
	},
	mixins: [utilsMixin],
	props: {
		disabled: Boolean,
		userChoices: { type: Array, default() { return null } },
		value: { type: Array },
		usernameKey: { type: String, default: "username" },
		nameKeys: { type: Array, default() { return ["first_name", "last_name"] } },
		showName: { type: Boolean, default: false },
		userType: { type: String },
		dense: { type: Boolean, default: true },
		showLoading: { type: Boolean, default: false },
		width: { type: String | Number },
		height: { type: String | Number },
		minWidth: { type: String | Number },
		minHeight: { type: String | Number },
		maxWidth: { type: String | Number },
		maxHeight: { type: String | Number, default: "400px" },
	},
	methods: {
		getSelectedValue(item) {
			if (Array.isArray(this.value))
				return this.value.includes(item.id)
			return false
		},
		updateSelected(item) {
			let r = structuredClone(this.value)
			if (r.includes(item.id))
				r.splice(r.indexOf(item.id), 1)
			else
				r.push(item.id)
			this.$emit('input', r)
		},
		getName(item) {
			let first_or_last_name = (
				(item[this.nameKeys[0]] &&
					item[this.nameKeys[0]].length > 0)
				||
				(item[this.nameKeys[1]] &&
					item[this.nameKeys[1]].length > 0)
			)
			let name = `${item[this.nameKeys[0]]} ${item[this.nameKeys[1]]}`
			if (this.showName && first_or_last_name)
				return `${name} (${item[this.usernameKey]})`
			return item[this.usernameKey]
		},
		getStyle() {
			let r = "height: 100%; width: 100%;"
			let cssClasses = [
				"minWidth",
				"minHeight",
				"maxWidth",
				"maxHeight"
			]
			cssClasses.forEach(cssKey => {
				if (this._props[cssKey] !== undefined) {
					let prop_value = this._props[cssKey]
					if (typeof prop_value == "number")
						prop_value = String(prop_value) + "px"
					r = r + `${this.toPropCase(cssKey)}: ${prop_value};`
				}
			});
			return r
		},
		clearData() {
			this.loading = true
			this.error = false
			if (this.value !== undefined && this.value !== null && Array.isArray(this.value))
				this.selected = this.value
			else
				this.selected = []
			this.items = []
		}
	},
}
</script>