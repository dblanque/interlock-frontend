<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: ModularViewContainer.vue ---------------------->
<template>
	<div class="my-4">
		<v-row class="ma-2" justify="center" align="center">
			<v-divider class="mx-6" />
			<h1>{{ getViewTitle() }}</h1>
			<v-divider class="mx-6" />
		</v-row>

		<!-- HOME -->
		<v-container v-if="viewTitle == 'home'" :class="getContainerClasses()">
			<HomeViewContainer
				ref="HomeViewContainer"
				:viewTitle="viewTitle"
				:init-load="initLoad"
				@done="emitDone"
				:requestRefresh="undefined"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction" />
		</v-container>

		<!-- APPLICATION -->
		<v-container v-if="viewTitle == 'applications'" :class="getContainerClasses()">
			<ApplicationView
				ref="ApplicationView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:requestRefresh="undefined"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction" />
		</v-container>

		<!-- DIRTREE -->
		<v-container v-if="viewTitle == 'ldap-dirtree'" :class="getContainerClasses()">
			<DirtreeView
				ref="DirtreeView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction"
				@goToUser="goToUser"
				@goToGroup="goToGroup" />
		</v-container>

		<!-- USERS -->
		<v-container v-if="viewTitle == 'django-users'" :class="getContainerClasses()">
			<UserView ref="DjangoUserView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction"
				@goToGroup="goToGroup" />
		</v-container>

		<!-- GROUPS -->
		<v-container v-if="viewTitle == 'application-groups'" :class="getContainerClasses()">
			<GroupView ref="ApplicationGroupView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction" />
		</v-container>

		<!-- USERS -->
		<v-container v-if="viewTitle == 'ldap-users'" :class="getContainerClasses()">
			<UserView ref="LdapUserView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction"
				@goToGroup="goToGroup" />
		</v-container>

		<!-- GROUPS -->
		<v-container v-if="viewTitle == 'ldap-groups'" :class="getContainerClasses()">
			<GroupView ref="LdapGroupView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction" />
		</v-container>

		<!-- DNS -->
		<v-container v-if="viewTitle == 'ldap-dns'" :class="getContainerClasses()">
			<dnsView ref="dnsView"
				:viewTitle="viewTitle"
				@done="emitDone"
				:snackbarTimeout="this.snackbarTimeout"
				@refresh="refreshAction" />
		</v-container>

		<!-- GPO -->
		<v-container v-if="viewTitle == 'ldap-gpo'" :class="getContainerClasses()">
			<GpoView
				:viewTitle="viewTitle"
				@done="emitDone"
				class="my-2 mb-4"
				ref="gpoView" />
		</v-container>

		<!-- Settings -->
		<v-container v-if="viewTitle == 'settings'" :class="getContainerClasses()">
			<SettingsCard
				:viewTitle="viewTitle"
				@done="emitDone"
				class="my-2 mb-4"
				ref="SettingsView"
				@refreshDomain="refreshDomainAction()" />
		</v-container>

		<!-- Logs -->
		<v-container v-if="viewTitle == 'logs'" :class="getContainerClasses()">
			<LogView
				:viewTitle="viewTitle"
				@done="emitDone"
				class="my-2 mb-4"
				ref="LogView" />
		</v-container>

		<!-- Debugging -->
		<v-container v-if="viewTitle == 'debug'" :class="getContainerClasses()">
			<DebugView
				:viewTitle="viewTitle"
				@done="emitDone"
				class="my-2 mb-4"
				ref="DebugView" />
		</v-container>
	</div>
</template>

<script>
import HomeViewContainer from '@/components/Home/HomeViewContainer.vue';
import ApplicationView from '@/components/Application/ApplicationView.vue';
import UserView from '@/components/User/UserView.vue';
import GroupView from '@/components/Group/GroupView.vue';
import DirtreeView from '@/components/Dirtree/DirtreeView.vue';
import dnsView from '@/components/DNS/dnsView.vue';
import SettingsCard from '@/components/Settings/SettingsCard.vue';
import LogView from '@/components/Logging/LogView.vue';
import DebugView from '@/components/Debug/DebugView.vue';
import GpoView from '@/components/GPO/GPOView.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';

export default {
	name: 'ModularViewContainer',
	mixins: [validationMixin],
	components: {
		HomeViewContainer,
		ApplicationView,
		UserView,
		GroupView,
		DirtreeView,
		dnsView,
		SettingsCard,
		LogView,
		DebugView,
		GpoView
	},
	props: {
		viewTitle: String,
		viewIndex: Number,
		langChanged: Boolean,
		requestRefresh: String,
		initLoad: Boolean,
		mobile: Boolean,
	},
	data() {
		return {
			containerClasses: [
				"max-width-change"
			],
			refreshOnClose: false,
			userRefreshLoading: false,
			error: false,
			snackbarMessage: "",
			snackbarIcon: "",
			snackbarColor: "",
			snackbarClasses: "",
			snackbar: false,
			snackbarTimeout: 2e3,
		}
	},
	watch: {
		langChanged: {
			handler: function () {
				switch (this.viewTitle) {
					case 'applications':
						if (this.$refs.ApplicationView !== undefined)
							this.$refs.ApplicationView.reloadDataTableHeaders()
						break;
					case 'ldap-users':
					case 'django-users':
						if (this.$refs.UserView !== undefined)
							this.$refs.UserView.reloadDataTableHeaders()
						break;
					case 'ldap-groups':
					case 'application-groups':
						if (this.$refs.GroupView !== undefined)
							this.$refs.GroupView.reloadDataTableHeaders()
						break;
					case 'logs':
						if (this.$refs.LogView !== undefined)
							this.$refs.LogView.reloadDataTableHeaders()
						break;
					case 'ldap-dns':
						if (this.$refs.dnsView !== undefined)
							this.$refs.dnsView.reloadDataTableHeaders()
						break;
					default:
						break;
				}
			}
		},
		requestRefresh(newValue) {
			this.$emit('loading')
			switch (newValue) {
				case 'home':
					if (this.$refs.HomeViewContainer != undefined) {
						console.log("Requested refresh for view component " + newValue)
						this.$refs.HomeViewContainer.fetchHomeInfo()
					}
					break;
				case 'applications':
					if (this.$refs.ApplicationView != undefined) {
						console.log("Requested refresh for view component " + newValue)
						this.$refs.ApplicationView.listApplicationItems(true)
					}
					break;
				case 'ldap-dirtree':
					if (this.$refs.DirtreeView != undefined) {
						console.log("Requested refresh for view component " + newValue)
						this.$refs.DirtreeView.resetSearch()
						this.$refs.DirtreeView.resetDirtree(true)
					}
					break;
				case 'ldap-users':
					if (this.$refs.LdapUserView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.LdapUserView.resetSearch()
						this.$refs.LdapUserView.listUserItems(true)
					}
					break;
				case 'django-users':
					if (this.$refs.DjangoUserView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.DjangoUserView.resetSearch()
						this.$refs.DjangoUserView.listUserItems(true)
					}
					break;
				case 'ldap-groups':
					if (this.$refs.LdapGroupView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.LdapGroupView.resetSearch()
						this.$refs.LdapGroupView.listGroupItems(true)
					}
					break;
				case 'settings':
					if (this.$refs.SettingsView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.SettingsView.refreshSettings(true, true)
					}
					break;
				case 'logs':
					if (this.$refs.LogView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.LogView.resetSearch()
						this.$refs.LogView.listLogs(true)
					}
					break;
				case 'ldap-dns':
					if (this.$refs.dnsView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.dnsView.getDNSData()
					}
					break;
				case 'debug':
					if (this.$refs.DebugView != undefined) {
						console.log("Requested refresh for component " + newValue)
						this.$refs.DebugView.refreshAction()
					}
					break;
				default:
					if (newValue)
						console.log("Requested refresh for component " + newValue)
					break;
			}
			this.emitDone()
		},
	},
	methods: {
		emitDone() {
			this.$emit('done')
		},
		getContainerClasses() {
			let _c = [...this.containerClasses]
			// Add classes to desktop
			// if (!this.mobile) {
			// }
			return _c.join(" ");
		},
		getViewTitle() {
			let translation_key = "category.header." + this.viewTitle
			if (translation_key == this.$t(translation_key))
				return this.$t("category." + this.viewTitle)
			return this.$t(translation_key)
		},
		goToUser(user) {
			this.$emit('goToUser', user)
		},
		goToGroup(group) {
			this.$emit('goToGroup', group)
		},
		async saveData(key, data) {
			switch (key) {
				case 'userDialog':
					this.refreshOnClose = true
					break;
				default:
					console.log(key)
					console.log(data)
					break;
			}
		},
		refreshDomainAction() {
			this.$emit('refreshDomain')
		},
		refreshAction() {
			// Reset all filters if refreshing dirtree view
			if (this.viewTitle == 'ldap-dirtree')
				Object.keys(this.itemTypes).forEach(key => {
					this.itemTypes[key]['filtered'] = false
				});
			this.$emit('refresh')
			this.userRefreshLoading = false;
			this.refreshOnClose = false
		}
	}
}
</script>
<style>
.max-width-change {
	max-width: max(90%, 1100px);
}
</style>