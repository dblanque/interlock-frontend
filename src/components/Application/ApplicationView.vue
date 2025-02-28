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
			<!-- USER ACTIONS -->
			<template v-slot:[`item.actions`]="{ item }">
				<v-row class="my-1">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
							rounded
							v-bind="attrs"
							v-on="on"
							small
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

		<!-- USER EDIT DIALOG -->
		<v-dialog eager max-width="1000px" v-model="dialogs['create']">
			<ApplicationCreate
			:viewKey="'create'"
			ref="ApplicationCreate"
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
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: 'ApplicationView',
	components: {
		ApplicationCreate
	},
	mixins: [ utilsMixin ],
	props: {
		viewTitle: String,
		snackbarTimeout: Number
	},
	data() {
		return {
			loading: false,
			tableData: {
				headers: [],
				items: [],
				selected: []
			},
			// Dialog States
			dialogs: {
				create: false,
				update: false,
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
					headerDict.text = this.$tc('section.application.attribute.' + header, 1)
					headerDict.value = header
					if (header == 'enabled') {
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
		openDialog(key){
			this.dialogs[key] = true;
			switch (key) {
				case 'update':
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