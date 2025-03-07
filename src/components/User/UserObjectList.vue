<template>
	<div class="ma-0 pa-0" :style="getStyle()">
		<v-progress-linear :loading="loading" v-if="showLoading"></v-progress-linear>
		<v-list :dense="dense">
			<v-list-item-group
				v-model="selected"
				multiple>
				<v-list-item v-for="(item, index) in (users !== null ? users : items)"
					:key="item[usernameKey]">
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
import { notificationBus } from '@/main.js';
import DjangoUser from '@/include/DjangoUser.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	data() {
		return {
			items: [],
			loading: true,
			error: false,
			selected: []
		}
	},
	mixins: [utilsMixin],
	props: {
		users: { type: Array, default() { return null }},
		value: { type: Array },
		valueKey: { type: String | Array, default: "id" },
		usernameKey: { type: String, default: "username" },
		returnKeys: { type: Array, default() { return ["id", "username", "dn"] }},
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
	watch: {
		selected(newValue) {
			let target = this.users !== null ? this.users : this.items
			let r = []
			for (let i = 0; i < target.length; i++) {
				if (newValue.includes(i)) {
					if (this.returnKeys.length > 1) {
						const filtered = Object.keys(target[i])
							.filter(key => this.returnKeys.includes(key))
							.reduce((obj, key) => {
								obj[key] = target[i][key];
								return obj;
							}, {});
						r.push(filtered)
					} else {
						r.push(target[i][this.returnKeys[0]])
					}
				}
			}
			this.$emit('input', r)
		},
	},
	computed: {
	},
	methods: {
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
			this.selected = []
			this.items = []
		},
		async init() {
			this.clearData()
			await new DjangoUser({}).list()
				.then(response => {
					this.items = response.users
					this.loading = false
					this.error = false
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					notificationBus.$emit("createNotification",
						{
							message: this.getMessageForCode(error), type: 'error'
						})
				})
		}
	},
}
</script>