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
			<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
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
					<v-card max-height="400" width="100%" height="100%" outlined>
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
				<CNObjectList :dialogKey="'addLDAPGroup'" ref="AddLDAPGroup" :add-button="false"
					value-key="distinguished_name" v-model="ldap_objects" :enableUsers="false"
					:disabled="actionDisabled" content-class="ma-0 pa-0" :showHeader="false" />
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
import CNObjectList from '@/components/CNObjectList.vue';
import UserObjectList from '@/components/User/UserObjectList.vue';
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
	name: 'ApplicationGroupForm',
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
			return !this.editFlag && !this.createFlag || this.disabled
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
		init() {
			this.$refs.AddLDAPGroup.fetchLists()
			this.$refs.UserObjectList.clearData()
		},
		validate() {
			return this.$refs.form.validate()
		},
		resetValidation() {
			return this.$refs.form.resetValidation()
		},
	}
}
</script>
