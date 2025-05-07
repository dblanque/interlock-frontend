<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserDelete.vue ------------------------------>
<template>
	<v-card>
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="pa-0 ma-0 ma-2">
					{{ $t('section.users.deleteUser.title') }}
				</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
				<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>

		<v-card-text class="pa-0 ma-0">
			<v-row class="pa-0 ma-8 text-subtitle-1" justify="center">
				{{ !multipleUsers ? $t('section.users.deleteUser.message') : '' }}
				<span v-if="!multipleUsers" class="font-weight-medium" style="padding-left: 0.5ch;">
					{{ (userObject.first_name && userObject.last_name ? userObject.first_name + " " +
						userObject.last_name + " (" + userObject.username + ")" : userObject.username) + "?" }}
				</span>
				<span v-else-if="multipleUsers" class="font-weight-medium"
					style="padding-left: 0.5ch;">
					{{ $t('section.users.deleteUser.mass') + "?" }}
					<span v-for="user in userObjectList" :key="user.username">
						<br>
						{{ `${user.first_name} ${user.last_name} (${user.username})` }}
					</span>
				</span>
			</v-row>
		</v-card-text>
		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
				<v-btn @keydown.enter="closeDialog(true)"
					@click="closeDialog(true)"
					:dark="!isThemeDark($vuetify)"
					:light="isThemeDark($vuetify)"
					class="ma-0 pa-0 pa-2 ma-1"
					rounded>
					<v-icon class="mr-1" color="green">
						mdi-checkbox-marked-circle-outline
					</v-icon>
					<span class="pr-1">
						{{ $t("actions.yes") }}
					</span>
				</v-btn>
				<v-btn @click="closeDialog"
					class="ma-0 pa-0 pa-2 ma-1"
					:dark="!isThemeDark($vuetify)"
					:light="isThemeDark($vuetify)"
					rounded>
					<span class="pl-1">
						{{ $t("actions.no") }}
					</span>
					<v-icon class="ml-1" color="red">
						mdi-close-circle-outline
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
	name: "UserDelete",
	mixins: [utilsMixin],
	props: {
		userObject: Object,
		userObjectList: Array,
		dialogKey: String,
		massDelete: Boolean,
		userClass: Function,
		parentTitle: String,
	},
	created() {
	},
	computed: {
		multipleUsers() {
			return this.userObjectList.length > 0
		}
	},
	methods: {
		async closeDialog(deleteConfirm = false, user = {}) {
			if (!this.multipleUsers) {
				if (user != {}) {
					if (this.parentTitle == "ldap-users") {
						user.distinguished_name = this.userObject.distinguished_name
						user.username = this.userObject.username
					} else {
						user.id = this.userObject.id
						user.username = this.userObject.username
					}
				}
			}

			if (deleteConfirm == true) {
				if (this.multipleUsers) {
					await new this.userClass({}).bulkDelete(this.userObjectList)
						.then(() => { })
						.catch(error => { console.error(error) })
				} else {
					await new this.userClass({}).delete(user)
						.then(response => {
							this.$emit('closeDialog', this.dialogKey, true);
						})
						.catch(error => {
							console.error(error)
							this.$emit('closeDialog', this.dialogKey, true, {
								message: this.getMessageForCode(error),
								type: 'error'
							});
						})
				}
			} else {
				this.$emit('closeDialog', this.dialogKey);
			}
		},
	}
}
</script>
