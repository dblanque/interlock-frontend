<template>
	<v-form ref="form" class="ma-0 pa-0 mt-8">
		<v-row justify="center" v-if="createFlag">
			<v-col>
				<v-select
					:rules="[inputRulesRequired]"
					:items="application_choices"
					item-text="name"
					item-value="id"
					required
					v-model="application"
					:label="$tc('classes.application', 1)">
				</v-select>
			</v-col>
		</v-row>
		<v-row justify="center" v-else>
			<v-col>
				<h2>
					{{ applicationName }}
				</h2>
			</v-col>
		</v-row>

		<v-row align-content="center" justify="center" v-if="!createFlag">
			<v-col class="ma-0 pa-0 mx-2" cols="auto">
				<v-checkbox
					dense
					id="enabled"
					:label="$t('words.enabled')"
					v-model="enabled"
					:disabled="actionDisabled" />
			</v-col>
		</v-row>

		<!-- Application Group Form -->
		<v-row justify="center" class="mt-8 mb-4">
			<h2>
				{{ $t('category.header.django-users') }}
			</h2>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-expand-transition>
					<v-card max-height="400" width="100%" height="100%" outlined
						v-if="user_choices && user_choices.length >= 1">
						<UserObjectList :user-choices="user_choices" ref="UserObjectList"
							:return-keys="['id']" :disabled="actionDisabled"
							show-name v-model="users" dense user-type="local" />
					</v-card>
				</v-expand-transition>
			</v-col>
		</v-row>
		<v-row justify="center" class="mt-8 mb-4">
			<h2>
				{{ $t('category.header.ldap-groups') }}
			</h2>
		</v-row>
		<v-row>
			<v-col cols="12" class="ma-0 pa-0">
				<!-- MemberList -->
				<MemberList
					:members="value.ldap_objects"
					flat-data
					:show-members="value.ldap_objects && value.ldap_objects.length >= 1"
					:edit-flag="editFlag || createFlag"
					@remove="removeMember"
					@open-add-member="openDialog('addLDAPGroup')"
					/>
			</v-col>
		</v-row>
		
		<!-- ADD TO GROUP DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['addLDAPGroup']">
				<CNObjectList
					:dialogKey="'addLDAPGroup'"
					ref="AddLDAPGroup"
					value-key="distinguished_name"
					v-model="ldap_objects"
					:enable-users="false"
					:disabled="actionDisabled"
					:add-button="false"
					done-button
					@done="dialogs['addLDAPGroup'] = false"
					@closeDialog="dialogs['addLDAPGroup'] = false"
					content-class="ma-0 pa-0"/>
		</v-dialog>
	</v-form>
</template>

<script>
import CNObjectList from '@/components/CNObjectList.vue';
import UserObjectList from '@/components/User/UserObjectList.vue';
import validationMixin from '@/plugins/mixin/validationMixin';
import MemberList from '@/components/Group/MemberList.vue';

export default {
	name: 'ApplicationGroupForm',
	components: {
		CNObjectList,
		UserObjectList,
		MemberList,
	},
	data() {
		return {
			dialogs:{
				addLDAPGroup: false,
			}
		};
	},
	mixins: [validationMixin],
	props: {
		disabled: Boolean,
		value: { type: Object, required: true },
		user_choices: { type: Array },
		application_choices: { type: Array },
		editFlag: { type: Boolean, default: false },
		createFlag: { type: Boolean, default: false },
	},
	computed: {
		applicationName() {
			if (this.value?.application?.name !== undefined &&
				this.value?.application?.name !== null) {
				return this.value.application.name
			}
			return this.value.application
		},
		actionDisabled() {
			return (!this.editFlag && !this.createFlag) || this.disabled
		},
		application: {
			get() { return this.value.application; },
			set(v) { this.$emit('input', { ...this.value, application: v }) }
		},
		enabled: {
			get() { return this.value.enabled; },
			set(v) { this.$emit('input', { ...this.value, enabled: v }) }
		},
		users: {
			get() { return this.value.users; },
			set(v) { this.$emit('input', { ...this.value, users: v }) }
		},
		ldap_objects: {
			get() { return this.value.ldap_objects; },
			set(v) { this.$emit('input', { ...this.value, ldap_objects: v }) }
		},
	},
	methods: {
		init(options = {}) {
			// if (options?.fetch_lists !== false) {
			// 	this.$refs.AddLDAPGroup.fetchLists()
			// }
			// if (options?.clear_data !== false) {
			// 	this.$refs.UserObjectList.clearData()
			// }
		},
		validate() {
			return this.$refs.form.validate()
		},
		resetValidation() {
			return this.$refs.form.resetValidation()
		},
		removeMember(distinguished_name){
			if (this.value?.ldap_objects === undefined)
				return
			if (!Array.isArray(this.value?.ldap_objects))
				return
			if (this.value?.ldap_objects.includes(distinguished_name)) {
				const _index = this.value?.ldap_objects.indexOf(distinguished_name)
				const _new_ldap_objects = structuredClone(this.value?.ldap_objects)
				_new_ldap_objects.splice(_index, 1)
				this.$emit('input', { ...this.value, ldap_objects: _new_ldap_objects })
			}
		},
		openDialog(key) {
			this.dialogs[key] = true;
			switch (key) {
				case 'addLDAPGroup':
					this.$refs.AddLDAPGroup.fetchLists(this.excludeDNs)
					break;
				default:
					break;
			}
		},
	}
}
</script>
