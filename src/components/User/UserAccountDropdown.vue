<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!---------------------- File: UserAccountDropdown.vue ------------------------>
<template>
	<v-menu v-model="menu_expanded" open-on-focus open-on-hover
		class="ma-0 pa-0" offset-y :dense="denseMenu">
		<template v-slot:activator="{ on, attrs }">
			<v-btn :class="'ma-0 pa-0 ' + extraClasses"
				:color="color"
				dark
				outlined
				:min-width="minWidth"
				:small="denseActivator"
				v-bind="attrs"
				v-on="on">
				<v-icon v-if="icon.length > 0" class="mr-2">
					{{ icon }}
				</v-icon>
				{{ $t("userAccountDropdown.title") }}
				<v-icon>
				</v-icon>
			</v-btn>
		</template>
		<!-- Inner Content -->
		<v-list flat class="px-2" :dense="denseMenu">
			<v-list-item-group>
				<v-list-item>
					{{ username }}
				</v-list-item>
			</v-list-item-group>
			<v-divider style="border-color: var(--v-primary-base)" class="my-1 mx-4" />
			<v-list-item-group>
				<v-list-item v-for="v, k in entries" :key="k" link @click="doFn(v.action)">
					<v-list-item-action class="ma-0 pa-0">
						<v-row>
							<v-icon color="primary" v-if="v.prepend_icon.length > 0" class="mr-2">
								{{ v.prepend_icon }}
							</v-icon>
							{{ $t(v.i18n_string) }}
							<v-icon color="primary" v-if="v.append_icon.length > 0" class="ml-2">
								{{ v.append_icon }}
							</v-icon>
						</v-row>
					</v-list-item-action>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
	name: "UserAccountDropdown",
	mixins: [utilsMixin],
	props: {
		color: String,
		extraClasses: String,
		denseActivator: Boolean,
		denseMenu: {
			type: Boolean,
			default: true
		},
		username: String,
		icon: String,
		showPreferencesMenu: Boolean
	},
	created() {
		if (this.showPreferencesMenu)
			this.entries.unshift(
				{
					i18n_string: "userAccountDropdown.changePreferences",
					action: "this.openAccountSettings",
					prepend_icon: "mdi-cog",
					append_icon: ""
				}
			)
	},
	data() {
		return {
			menu_expanded: false,
			entries: [
				{
					i18n_string: "userAccountDropdown.logout",
					action: "this.emitLogout",
					prepend_icon: "mdi-logout",
					append_icon: ""
				}
			]
		}
	},
	computed: {
		minWidth() {
			return String(this.username.length + 4) + "ch"
		}
	},
	methods: {
		emitLogout() {
			this.$emit('logout')
		},
		openAccountSettings() {
			this.$emit('openSettings')
		},
		doFn(f) {
			eval(f + "()")
		}
	}
}
</script>