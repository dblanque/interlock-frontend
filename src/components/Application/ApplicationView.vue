<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: ApplicationView.vue ------------------------->
<template>
	<div>
		<v-data-table
		:headers="tableData.headers"
		item-key="distinguishedName"
		v-model="tableData.selected"
		:items="tableData.items"
		:loading="loading"
		:footer-props="{
			'items-per-page-options': [10, 25, 50, 100, -1]
		}"
		sort-by="name"
		class="py-3 px-2 my-2">
			<!-- Table Header -->
			<template v-slot:top>
				<v-row align="center" justify="end" class="px-2 mx-1 py-0 my-0">
					<refresh-button dense
					:loading="loading"
					@refresh="listApplicationItems"/>
					<v-btn class="pa-2 mx-2" :disabled="loading" color="primary" @click="openDialog('create')">
						<v-icon class="ma-0 pa-0">mdi-plus</v-icon>
						{{ $t('actions.addN') + ' ' + $tc('classes.application', 1) }}
					</v-btn>
				</v-row>
			</template>

			<!-- APPLICATION STATUS -->
			<template v-slot:[`item.enabled`]="{ item }">
				<!-- Enable Application Button -->
				<v-tooltip color="red" bottom v-if="item.enabled">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon
					rounded
					v-bind="attrs"
					v-on="on"
					:disabled="loading"
					@click="toggleApplicationStatus(item, false)"
					>
					<v-icon color="valid-40-s">
					mdi-check
					</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('actions.clickTo') + " " + $t('actions.disable') + " " + item.name }}</span>
				</v-tooltip>

				<!-- Disable Application Button -->
				<v-tooltip color="green" bottom v-else-if="!item.enabled">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon
					rounded
					v-bind="attrs"
					v-on="on"
					:disabled="loading"
					@click="toggleApplicationStatus(item, true)"
					>
					<v-icon color="error-60-s">
					mdi-close
					</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('actions.clickTo') + " " + $t('actions.enable') + " " + item.name }}</span>
				</v-tooltip>
			</template>


			<!-- APPLICATION ACTIONS -->
			<template v-slot:[`item.actions`]="{ item }">
				<v-row class="my-1" justify="center">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
							rounded
							v-bind="attrs"
							v-on="on"
							small
							@click="fetchApplication(item)"
							:disabled="loading"
							>
							<v-icon small color="primary">
								mdi-eye
							</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('actions.view') }}</span>
				</v-tooltip>
				
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
						rounded
						v-bind="attrs"
						v-on="on"
						small
						:disabled="loading"
						@click="fetchApplication(item, true)"
						>
						<v-icon small color="primary">
							mdi-pencil
						</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('actions.edit') }}</span>
			</v-tooltip>
			
			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
				<v-btn icon
					rounded
					@click="deleteApplication(item)"
					v-bind="attrs"
					v-on="on"
					small
					:disabled="loading"
				>
				<v-icon small color="red">
					mdi-delete
				</v-icon>
				</v-btn>
				</template>
				<span>{{ $t('actions.delete') }}</span>
			</v-tooltip>
		</v-row>
			</template>
		</v-data-table>

		<!-- APPLICATION CREATE DIALOG -->
		<v-dialog eager max-width="1000px" v-model="dialogs['create']">
			<ApplicationCreate
			:viewKey="'create'"
			ref="ApplicationCreate"
			@closeDialog="closeDialog"
			@refresh="listApplicationItems"
			/>
		</v-dialog>

		<!-- APPLICATION VIEW OR UPDATE DIALOG -->
		<v-dialog eager max-width="1000px" v-model="dialogs['update']">
			<ApplicationDialog
			ref="ApplicationDialog"
			:refreshLoading="loading"
			:viewKey="'update'"
			:applicationObject="applicationObject"
			:selectedApplication="selectedApplication"
			:editFlag="editFlag"
			@editToggle="editFlag = !editFlag"
			@closeDialog="closeDialog"
			@refreshApplication="refreshApplication"
			/>
		</v-dialog>

		<!-- APPLICATION DELETE DIALOG -->
		<v-dialog eager max-width="1000px" v-model="dialogs['delete']">
			<ApplicationDelete
			:viewKey="'delete'"
	  	:selectedApplication="selectedApplication"
			ref="ApplicationDelete"
			@closeDialog="closeDialog"
			@refresh="listApplicationItems"
			/>
		</v-dialog>
	</div>
</template>

<script>
import { notificationBus } from '@/main.js';
import Application from '@/include/Application.js';
import ApplicationCreate from '@/components/Application/ApplicationCreate.vue';
import ApplicationDialog from '@/components/Application/ApplicationDialog.vue';
import ApplicationDelete from '@/components/Application/ApplicationDelete.vue';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: 'ApplicationView',
	components: {
		ApplicationCreate,
		ApplicationDialog,
		ApplicationDelete
	},
	mixins: [ utilsMixin ],
	props: {
		viewTitle: String,
		snackbarTimeout: Number
	},
	data() {
		return {
			loading: false,
			editFlag: false,
			selectedApplication: {},
			applicationObject: {},
			tableData: {
				headers: [],
				items: [],
				selected: []
			},
			// Dialog States
			dialogs: {
				create: false,
				update: false,
				delete: false
			}
		}
	},
	created() {
		this.listApplicationItems();
	},
	methods: {
		async listApplicationItems(emitNotif=true) {
			this.loading = true
			this.error = false
			this.tableData.headers = []
			this.tableData.items = []
			this.tableData.selected = []
			await new Application({}).list()
			.then(response => {
				this.tableData.items = response.applications
				this.tableData.headers = []
				let headerDict = {}
				response.headers.forEach(header => {
					headerDict = {}
					headerDict.text = this.$tc('section.applications.attribute.' + header, 1)
					headerDict.value = header
					if (header == 'enabled') {
						headerDict.text = this.$t("words.enabled")
						headerDict.align = 'center'
						headerDict.sortable = false
					}
					this.tableData.headers.push(headerDict)
				});
				headerDict = {}
				headerDict.text = this.$t('actions.label')
				headerDict.value = 'actions'
				headerDict.align = 'center'
				headerDict.sortable = false
				this.tableData.headers.push(headerDict)
				this.loading = false
				this.error = false
				this.errorMsg = ""
			})
			.catch(error => {
				console.error(error)
				this.loading = false
				this.error = true
				this.errorMsg = this.getMessageForCode(error)
				notificationBus.$emit('createNotification', 
					{message: this.errorMsg.toUpperCase(), type: 'error'}
				)
			})
		},
		async deleteApplication(selectedApplication) {
			this.selectedApplication = {}
			this.selectedApplication = selectedApplication
			this.openDialog('delete')
		},
		// Fetch individual Application
		async fetchApplication(item, isEditable=false, openedDialogLoading=false) {
			if(!openedDialogLoading)
				this.loading = true
			this.fetchingData = true
			this.selectedApplication.id = item.id
			this.selectedApplication.name = item.name
			this.applicationObject = new Application({})
			await this.applicationObject.fetch(this.selectedApplication.id)
			.then(response => {
				this.applicationObject = response.data
				if (this.dialogs.update !== true) {
					this.openDialog('update')
				}
				this.editFlag = isEditable
				setTimeout(() => {
					this.loading = false
				}, 50);
				this.fetchingData = false
			})
			.catch(error => {
				console.error(error)
				this.errorMsg = this.getMessageForCode(error)
				notificationBus.$emit('createNotification', 
					{message: this.errorMsg.toUpperCase(), type: 'error'}
				)
				this.loading = false
				this.fetchingData = false
				this.error = true;
			})
		},
		async toggleApplicationStatus(applicationObject, state){
			this.loading = true
			this.error = false
			this.errorMsg = false
			this.selectedApplication = {}
			this.selectedApplication = applicationObject
			this.selectedApplication.enabled = state
			let data = Object.assign({}, this.selectedApplication)
			let action = state === true ? "enabled" : "disabled"
			await new Application({}).update(data)
			.then(() => {
				this.loading = false
				this.error = false
				this.errorMsg = false
				this.listApplicationItems(false);
				notificationBus.$emit('createNotification', 
					{
					message: (this.$tc("classes.application", 1) + " " + this.$t("words."+action)).toUpperCase(), 
					type: 'success'
					});
			})
			.catch(error => {
				console.error(error)
				this.loading = false
				this.error = true
				this.errorMsg = this.getMessageForCode(error)
				notificationBus.$emit('createNotification', 
				{
					message: this.errorMsg.toUpperCase(), 
					type: 'error'
				});
			})
		},
		async refreshApplication(item){
			await this.fetchApplication(item, this.editFlag, true).then(()=>{
			if (this.$refs.ApplicationDialog != undefined)
				this.$refs.ApplicationDialog.syncApplication()
			});
		},
		openDialog(key){
			this.dialogs[key] = true;
			switch (key) {
				case 'view':
				case 'update':
					if (key == "update")
						this.editFlag = true;
					else
						this.editFlag = false;
					if (this.$refs.ApplicationDialog != undefined)
						this.$refs.ApplicationDialog.syncApplication()
				break;
				case 'create':
					if (this.$refs.ApplicationCreate != undefined)
						this.$refs.ApplicationCreate.newApplication()
				break;
				default:
				break;
			}
		},
		async closeDialog(key, refresh=false){
			this.dialogs[key] = false;
			if (refresh) {
				let emitNotif
				switch (key) {
					default:
						emitNotif = true
					break;
				}
				await this.listApplicationItems(emitNotif)
			}
		},
	}
}
</script>