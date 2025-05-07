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
				<v-radio-group @change="updateType"
				mandatory
				:readonly="!editFlag"
				:disabled="!editFlag"
				v-model="selectedType" class="ma-0 pa-0">
					<v-radio v-for="key, gt in groupTypes"
					:value="key"
					:key="key"
					:label="$t('section.groups.types.' + gt)"
					/>
				</v-radio-group>
			</v-card>
		</v-col>
		<v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
			<v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
				<v-row class="ma-2">
					{{ $t('section.groups.groupDialog.groupScope') }}
				</v-row>
				<v-radio-group @change="updateScope"
				mandatory
				:readonly="!editFlag"
				:disabled="!editFlag"
				v-model="selectedScope" class="ma-0 pa-0">
					<v-radio v-for="key, gs in groupScopes"
					:value="key"
					:key="key"
					:label="$t('section.groups.scopes.' + gs)"
					/>
				</v-radio-group>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import {
	GROUP_SCOPE_DEFAULT,
	GROUP_TYPE_DEFAULT,
	GROUP_TYPE_SYSTEM,
	LDAPGroupScopes,
	LDAPGroupTypes,
} from '@/include/constants/LDAPGroup.js';

export default {
	name: 'GroupTypeRadioGroups',
	props: {
		editFlag: Boolean,
		group: {
			type: Object,
			default: () => { return {} },
		},
	},
	data() {
		return {
			logWatch: false,
			selectedType: GROUP_TYPE_DEFAULT,
			selectedScope: GROUP_SCOPE_DEFAULT,
			groupTypes: LDAPGroupTypes,
			groupScopes: LDAPGroupScopes,
		}
	},
	watch: {
		group: {
			deep: true,
			handler: function () {
				this.reloadRadioValues()
			}
		},
		selectedType: {
			handler: function (newValue) {
				if (this.logWatch === true)
					console.log(newValue)
			}
		},
		selectedScope: {
			handler: function (newValue) {
				if (this.logWatch === true)
					console.log(newValue)
			}
		},
	},
	mounted () {
		this.reloadRadioValues();
	},
	methods: {
		getScope(){
			if (this.group)
				if (this.group.group_scopes && this.group.group_scopes.length > 0)
					return this.group.group_scopes[0]
			return GROUP_SCOPE_DEFAULT
		},
		getTypes(){
			if (this.group) {
				if (this.group.group_types && this.group.group_types.length > 0) {
					for (let i = 0; i < this.group.group_types.length; i++) {
						const t = this.group.group_types[i]
						if (t != GROUP_TYPE_SYSTEM)
							return t;
					}
				}
			}
			return GROUP_TYPE_DEFAULT
		},
		reloadRadioValues(){
			this.selectedType = this.getTypes();
			this.selectedScope = this.getScope();
		},
		updateType(){
			let v = this.selectedType
			this.$emit("update-type", v)
			this.$emit("updateType", v)
		},
		updateScope(){
			let v = this.selectedScope
			this.$emit("update-scope", v)
			this.$emit("updateScope", v)
		}
	},
}
</script>