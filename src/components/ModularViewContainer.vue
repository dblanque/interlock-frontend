<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: ModularViewContainer.vue ---------------------->
<template>
<div class="my-4">
	<v-row class="ma-2" justify="center" align="center">
		<v-divider class="mx-6"/>
		<h1>{{ getViewTitle() }}</h1>
		<v-divider class="mx-6"/>
	</v-row>

	<!-- HOME -->
	<v-container v-if="viewTitle == 'home' && initLoad == true" :class="getContainerClasses()">
		<HomeViewContainer
			ref="HomeViewContainer"
			:viewTitle="viewTitle"
			:requestRefresh="undefined"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
		/>
	</v-container>

	<!-- APPLICATION -->
	<v-container v-if="viewTitle == 'applications'" :class="getContainerClasses()">
		<ApplicationView
			ref="ApplicationView"
			:viewTitle="viewTitle"
			:requestRefresh="undefined"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
		/>
	</v-container>

	<!-- DIRTREE -->
	<v-container v-if="viewTitle == 'ldap-dirtree'" :class="getContainerClasses()">
		<DirtreeView
			ref="DirtreeView"
			:requestRefresh="this.refreshDirtreeTable"
			:viewTitle="viewTitle"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
			@goToUser="goToUser"
			@goToGroup="goToGroup"
		/>
	</v-container>

	<!-- USERS -->

	<v-container v-if="viewTitle == 'ldap-users'" :class="getContainerClasses()">
		<UserView ref="UserView"
			:requestRefresh="this.refreshUserDataTable"
			:viewTitle="viewTitle"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
			@goToGroup="goToGroup"
		/>
	</v-container>

	<!-- Groups -->
	<v-container v-if="viewTitle == 'ldap-groups'" :class="getContainerClasses()">
		<GroupView ref="GroupView"
			:requestRefresh="this.refreshGroupDataTable"
			:viewTitle="viewTitle"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
		/>
	</v-container>

	<!-- DNS -->
	<v-container v-if="viewTitle == 'ldap-dns'" :class="getContainerClasses()">
		<dnsView ref="dnsView"
			:requestRefresh="this.refreshDNSData"
			:viewTitle="viewTitle"
			:snackbarTimeout="this.snackbarTimeout"
			@refresh="refreshAction"
		/>
	</v-container>

	<!-- GPO -->
	<v-container v-if="viewTitle == 'ldap-gpo'" :class="getContainerClasses()">
		<GpoView
			:viewTitle="viewTitle"
			class="my-2 mb-4"
			ref="gpoView"
		/>
	</v-container>

	<!-- Settings -->
	<v-container v-if="viewTitle == 'settings'" :class="getContainerClasses()">
		<SettingsCard
			:viewTitle="viewTitle"
			class="my-2 mb-4"
			ref="SettingsView"
			@refreshDomain="refreshDomainAction()"
		/>
	</v-container>

	<!-- Logs -->
	<v-container v-if="viewTitle == 'logs'" :class="getContainerClasses()">
		<LogView
			:viewTitle="viewTitle"
			class="my-2 mb-4"
			ref="LogView"
		/>
	</v-container>

	<!-- Debugging -->
	<v-container v-if="viewTitle == 'debug'" :class="getContainerClasses()">
		<DebugView
			:viewTitle="viewTitle"
			class="my-2 mb-4"
			ref="DebugView"
		/>
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import GpoView from '@/components/GPO/GPOView.vue';

export default {
	name: 'ModularViewContainer',
	mixins: [ validationMixin ],
	components:{
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
	data () {
		return {
			containerClasses: [
				"max-width-change"
			],
			refreshDirtreeTable: false,
			refreshUserDataTable: false,
			refreshGroupDataTable: false,
			refreshDNSData: false,
			refreshOnClose: false,
			userRefreshLoading: false,
			error: false,
			snackbarMessage: "",
			snackbarIcon: "",
			snackbarColor: "",
			snackbarClasses: "",
			snackbar: false,
			snackbarTimeout: 2500,
		}
	},
	watch:{
		langChanged: {
			handler: function () {
				switch (this.viewTitle) {
					case 'ldap-users':
						this.$refs.UserView.reloadDataTableHeaders()
						break;
					case 'ldap-groups':
						this.$refs.GroupView.reloadDataTableHeaders()
						break;
					case 'logs':
						this.$refs.LogView.reloadDataTableHeaders()
						break;
					case 'ldap-dns':
						this.$refs.dnsView.reloadDataTableHeaders()
						break;
					default:
						break;
				}
			}
		},
		requestRefresh(newValue) {
			switch (newValue) {
				case 'home':
					break;
				case 'applications':
					if (this.$refs.ApplicationView != undefined) {
						console.log("Requested refresh for view component "+ newValue)
						this.$refs.ApplicationView.listApplicationItems()
					}
					break;
				case 'ldap-dirtree':
					if (this.$refs.DirtreeView != undefined) {
						console.log("Requested refresh for view component "+ newValue)
						this.$refs.DirtreeView.resetSearch()
						this.$refs.DirtreeView.resetDirtree(true)
					}
					break;
				case 'ldap-users':
					if (this.$refs.UserView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.UserView.resetSearch()
						this.$refs.UserView.listUserItems()
					}
					break;
				case 'ldap-groups':
					if (this.$refs.GroupView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.GroupView.resetSearch()
						this.$refs.GroupView.listGroupItems()
					}
					break;
				case 'settings':
					if (this.$refs.SettingsView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.SettingsView.refreshSettings(true, true)
					}
					break;
				case 'logs':
					if (this.$refs.LogView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.LogView.resetSearch()
						this.$refs.LogView.listLogs()
					}
					break;
				case 'ldap-dns':
					if (this.$refs.dnsView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.dnsView.getDNSData()
					}
					break;
				case 'debug':
					if (this.$refs.DebugView != undefined) {
						console.log("Requested refresh for component "+ newValue)
						this.$refs.DebugView.refreshAction()
					}
					break;
				default:
					if (newValue)
						console.log("Requested refresh for component "+ newValue)
					break;
			}
		},
	},
	computed: {
	},
	methods: {
		getContainerClasses(){
			let _c = [...this.containerClasses]
			// Add classes to desktop
			// if (!this.mobile) {
			// }
			return _c.join(" ");
		},
		getViewTitle(){
			let translation_key = "category.header." + this.viewTitle
			if (translation_key == this.$t(translation_key))
				return this.$t("category." + this.viewTitle)
			return this.$t(translation_key)
		},
		goToUser(user){
			this.$emit('goToUser', user)
		},
		goToGroup(group){
			this.$emit('goToGroup', group)
		},
		async saveData(key, data){
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