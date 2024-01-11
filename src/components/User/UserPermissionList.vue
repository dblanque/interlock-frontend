<template>
<!-- PERMISSIONS SCREEN -->
<v-card-text class="my-3 py-4">
	<v-row align-content="center" class="mb-2">
	<!-- Disabled Permissions Panel -->
	<v-col class="ma-0 pa-0" cols="12" md="8">
		<v-card outlined height="100%" class="ma-1 pa-4">
			<v-row justify="center"
			class="pa-0 ma-0 text-h6 mx-4 mb-5">
				{{ $t('section.users.perms') }}
			</v-row>
			<!-- List -->
			<v-list
			class="pa-0 ma-0 font-weight-medium" 
			:justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
				<!-- Items -->
				<v-list-item
				:disabled="disabled_permissions.includes(key)"
				two-line
				@click="onClickPermission(key)"
				:value="permissions[key].value"
				v-for="(value, key) in permissions"
				:key="key">
					<v-list-item-content class="pl-10">
						<!-- Title -->
						<v-list-item-title class="font-weight-bold">
						{{ $t('section.users.permissions.' + key) }}
						</v-list-item-title>
						<v-list-item-subtitle>
							{{ key }}
						</v-list-item-subtitle>
					</v-list-item-content>
						<v-list-item-action>
						<v-checkbox :disabled="!editFlag" @click="onClickPermission(key)" v-model="permissions[key].value"></v-checkbox>
						</v-list-item-action>
					</v-list-item>
			</v-list>
		</v-card>
	</v-col>
	<!-- Enabled Permissions Panel -->
	<v-col class="ma-0 pa-0" cols="12" md="4">
		<v-card outlined height="100%" class="ma-1 pa-4">
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
					outlined readonly v-model="getEnabledPerms" auto-grow>
					</v-textarea>
				</v-col>
				<v-col cols="12">
					<v-text-field hide-details :label="$t('section.users.permsCalc')"
					outlined readonly v-model="calcEnabledPerms">
					</v-text-field>
				</v-col>
			</v-row>
		</v-card>
	</v-col>
	</v-row>
</v-card-text>
</template>

<script>
import ldap_perm_json from '@/include/ldap_permissions.json'
export default {
    name: 'UserPermissionList',
	props: {
		editFlag: Boolean
	},
	data(){
		return {
			permissions: {},
			disabled_permissions: []
		}
	},
	created() {
		this.init()
	},
	computed: {
        calcEnabledPerms() {
            var result = 0
            for (const [key] of Object.entries(this.permissions)) {
                if (this.permissions[key].value == true) {
                    result += this.permissions[key].int
                }
            }
            return result
        },
        getEnabledPerms() {
            var array = []
            for (const [key] of Object.entries(this.permissions)) {
                if (this.permissions[key].value == true)
                    array.push(key)
            }
            return array
        },
	},
	methods: {
		init(){
			this.permissions = ldap_perm_json.permissions
			this.disabled_permissions = ldap_perm_json.disabled_permissions
		},
        // When a permission in the v-list changes this function is executed
        onClickPermission(key){
            if (this.editFlag == true) {
                this.permissions[key].value = !this.permissions[key].value
            }
        },
	}
}
</script>