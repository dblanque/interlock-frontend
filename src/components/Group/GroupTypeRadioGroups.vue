<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: GroupTypeRadioGroups.vue ------------------------>
<template>
	<v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4 px-1">
		<v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
			<v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
				<v-row class="ma-2">
					{{ $t('section.groups.groupDialog.groupType') }}
				</v-row>
				<v-radio-group
					mandatory
					:readonly="!editFlag"
					:disabled="!editFlag"
					:value="currentType" class="ma-0 pa-0">
					<v-radio v-for="value, key in LDAPGroupTypes"
						@change="updateType(value)"
						:value="value"
						:key="key"
						:label="$t('section.groups.types.' + key)" />
				</v-radio-group>
			</v-card>
		</v-col>
		<v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
			<v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
				<v-row class="ma-2">
					{{ $t('section.groups.groupDialog.groupScope') }}
				</v-row>
				<v-radio-group
					mandatory
					:readonly="!editFlag"
					:disabled="!editFlag"
					:value="currentScope" class="ma-0 pa-0">
					<v-radio v-for="value, key in LDAPGroupScopes"
						@change="updateScope(value)"
						:value="value"
						:key="key"
						:label="$t('section.groups.scopes.' + key)" />
				</v-radio-group>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import {
	GROUP_SCOPE_DEFAULT,
	GROUP_TYPE_DEFAULT,
	GROUP_TYPE_SYSTEM,
	LDAPGroupScopes,
	LDAPGroupTypes,
} from '@/include/constants/LDAPGroup.js';

export default {
	name: 'GroupTypeRadioGroups',
	mixins: [utilsMixin],
	props: {
		editFlag: Boolean,
		groupTypes: {
			type: Array,
			default: () => { return [GROUP_TYPE_DEFAULT] }
		},
		groupScopes: {
			type: Array,
			default: () => { return [GROUP_SCOPE_DEFAULT] }
		}
	},
	data() {
		return {
			log: false,
			currentType: GROUP_TYPE_DEFAULT,
			currentScope: GROUP_SCOPE_DEFAULT,
			LDAPGroupTypes: LDAPGroupTypes,
			LDAPGroupScopes: LDAPGroupScopes,
		}
	},
	watch: {
		groupTypes: {
			handler: function (val, oldVal) {
				this.setCurrentType()
				if (this.log === true) {
					console.log(val)
					console.log(this.currentType)
				}
			}
		},
		groupScopes: {
			handler: function (val, oldVal) {
				this.setCurrentScope()
				if (this.log === true) {
					console.log(val)
					console.log(this.currentScope)
				}
			}
		},
	},
	methods: {
		setCurrentScope() {
			this.currentScope = this.groupScopes[0]
		},
		setCurrentType() {
			for (let i = 0; i < this.groupTypes.length; i++) {
				const t = this.groupTypes[i]
				if (t != GROUP_TYPE_SYSTEM)
					this.currentType = t;
			}
		},
		update() {
			this.updateScope();
			this.updateType();
		},
		updateType(v) {
			let result = [v]
			if (this.groupTypes.includes(GROUP_TYPE_SYSTEM))
				result.push(GROUP_TYPE_SYSTEM)
			this.$emit("update-type", result)
			this.$emit("updateType", result)
		},
		updateScope(v) {
			let result = [v]
			this.$emit("update-scope", result)
			this.$emit("updateScope", result)
		}
	},
}
</script>