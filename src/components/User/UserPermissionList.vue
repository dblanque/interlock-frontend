<template>
<!-- PERMISSIONS SCREEN -->
<v-row align-content="center" :class="contentClass">
<!-- Disabled Permissions Panel -->
<v-col class="ma-0 pa-0" cols="12" :md="hideSidebar ? 12 : 8">
	<v-card height="100%" class="ma-0 pa-0" flat :outlined="!hideOutlines">
		<v-row height="100%" class="ma-0 pa-0">
			<v-row justify="center"
			class="pa-0 ma-0 text-h6 mt-5 mx-4 mb-5">
				{{ $t('section.users.perms') }}
			</v-row>
			<!-- List -->
			<v-list max-width="100%"
			class="pa-0 ma-0 font-weight-medium" 
			:justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
				<!-- Items -->
				<v-list-item
				:disabled="disabledPermissions.includes(p_key) || !editFlag"
				two-line
				@click="togglePermission(p_key)"
				:value="permissions[p_key].value"
				v-for="(p_opts, p_key) in permissions"
				:key="p_key">
					<v-list-item-content class="pl-10">
						<!-- Title -->
						<v-list-item-title class="font-weight-bold">
						{{ $t('section.users.permissions.' + p_key) }}
						</v-list-item-title>
						<v-list-item-subtitle>
							{{ p_key }}
						</v-list-item-subtitle>
					</v-list-item-content>
						<v-list-item-action>
						<v-checkbox :disabled="!editFlag" @click="togglePermission(p_key)" v-model="permissions[p_key].value"></v-checkbox>
						</v-list-item-action>
					</v-list-item>
			</v-list>
		</v-row>
	</v-card>
</v-col>
<!-- Enabled Permissions Panel -->
<v-col class="ma-0 pa-0" cols="12" md="4" v-if="!hideSidebar">
	<v-card height="100%" :class="'ma-0 pa-0 ' + marginRawOutputCol" flat :outlined="!hideOutlines">
		<v-row height="100%" class="ma-1 pa-4">
			<v-row justify="center" 
			class="pa-0 ma-0 text-h6 mx-4 mb-5">
				{{ $t('section.users.permsRaw') }}
			</v-row>
			<v-row class="pa-0 ma-0 font-weight-medium">
				<a href="https://docs.microsoft.com/en-US/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties"
				target="_blank" class="text-white">
				<v-alert type="info">
					{{ $t('section.users.permsRawHint') }}
				</v-alert>
				</a>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-textarea hide-details :label="$t('section.users.permsOutputArray')"
					:outlined="!hideOutlines" readonly v-model="enabledPermList" auto-grow>
					</v-textarea>
				</v-col>
				<v-col cols="12">
					<v-text-field hide-details :label="$t('section.users.permsCalc')"
					:outlined="!hideOutlines" readonly v-model="enabledPermInts">
					</v-text-field>
				</v-col>
			</v-row>
		</v-row>
	</v-card>
</v-col>
</v-row>
</template>

<script>
import ldap_perm_json from '@/include/ldap_permissions.json';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
export default {
    name: 'UserPermissionList',
	mixins: [ utilsMixin ],
	props: {
		emitDefault: {
			type: Boolean,
			default: false
		},
		editFlag: {
			type: Boolean,
			default: false
		},
		permissions: {
			type: Object,
			default() {
				return ldap_perm_json.permissions
			}
		},
		disabledPermissions: {
			type: Array,
			default() {
				return ldap_perm_json.disabled_permissions
			}
		},
		hideSidebar: {
			type: Boolean,
			default: false
		},
		contentClass: {
			type: String,
			default: "ma-0 pa-0"
		},
		hideOutlines: {
			type: Boolean,
			default: false
		}
	},
	created() {
		if (this.emitDefault === true)
			this.$emit('default', this.permissions)
		this.init()
	},
	computed: {
		marginRawOutputCol(){
			return this.$vuetify.breakpoint.mdAndUp ? 'ml-2' : 'mt-2'
		},
		enabledPermList(){
			return this.getEnabledPermissions(this.permissions)
		},
		enabledPermInts(){
			return this.calcEnabledPermissions(this.permissions)
		}
	},
	watch:{
        // 'permissions': {
        //     handler: function (newValue) {
        //         console.log(newValue)
        //     },
        //     deep: true
        // }
	},
	methods: {
		init(){
		},
        // When a permission in the v-list changes this function is executed
        togglePermission(key){
			if (!(key in this.permissions)) {
				console.error(`${key} not in Permission list.`)
				return
			}
            if (this.editFlag === true) {
				this.$emit('update', key)
            }
        },
	}
}
</script>