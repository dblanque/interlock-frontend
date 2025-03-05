<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!---------------------------- File: gpoView.vue ------------------------------>
<template>
	<v-data-table
		:headers="this.tableData.headers"
		:items="this.tableData.items"
		:custom-sort="sortNullLast"
		:loading="loading"
		:search="searchString"
		:footer-props="{
			'items-per-page-options': [10, 25, 50, 100, -1]
		}"
		sort-by="cn"
		class="py-3 px-2 mt-2 mb-2">
		<!-- Table Header -->
		<template v-slot:top>
			<v-row align="center" class="px-2 mx-1 py-0 my-0">
				<v-text-field
					v-model="searchString"
					clearable
					:label="$t('actions.search')"
					class="mx-2"
				></v-text-field>
				<v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
					<refresh-button dense
						:loading="loading"
						@refresh="listGPOItems"/>
					<v-btn class="pa-2 mx-2" :disabled="loading || readonly" color="primary" @click="false">
						<v-icon class="ma-0 pa-0">mdi-plus</v-icon>
						{{ $t('actions.addN') + ' ' + $tc('classes.gpo.short', 1) }}
					</v-btn>
				</v-row>
			</v-row>
		</template>

		<!-- ACTIONS -->
		<template v-slot:[`item.actions`]="{ item }">
			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon
						rounded
						v-bind="attrs"
						v-on="on"
						small
						:disabled="loading || readonly"
						@click="fetchGPO(item, false)"
					>
					<v-icon small color="primary">
						mdi-eye
					</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('actions.view') }}</span>
			</v-tooltip>
		</template>
	</v-data-table>
</template>

<script>
import { notificationBus } from '@/main.js';
import GPO from '@/include/GPO.js';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: 'gpoView',
	mixins: [ validationMixin, utilsMixin ],
	data() {
		return {
			readonly: false,
			fetchingData: false,
			tableData: {
				headers: [],
				items: []
			},
			searchString: "",
			loading: false,
			error: false,
			editableForm: false,
		}
	},
	methods: {
		// Reset Data Table variables
		resetDataTable(){
			this.tableData.headers = []
			this.tableData.items = []
		},
		// GPO Actions
		async listGPOItems(emitNotif=true){
			this.loading = true
			this.error = false
			this.tableData.headers = []
			this.tableData.items = []
			await new GPO({}).list()
			.then(response => {
				let gpoHeaders = response.headers
				let gpos = response.gpos
				// Reset Headers Array every time you list to avoid infinite header multiplication
				this.resetDataTable()
				let headerDict = {}
				gpoHeaders.forEach(header => {
					headerDict = {}
					headerDict.text = this.$t('attribute.ldap.' + header)
					headerDict.value = header
					if (header == 'hasMembers') {
						headerDict.sortable = false
						headerDict.align = 'center'
					}
					this.tableData.headers.push(headerDict)
				});
				headerDict = {}
				headerDict.text = this.$t('actions.label')
				headerDict.value = 'actions'
				headerDict.align = 'center'
				headerDict.sortable = false
				this.tableData.headers.push(headerDict)
				this.tableData.items = gpos
				this.loading = false
				this.error = false
				if (emitNotif == true)
					notificationBus.$emit('createNotification',
						{message: (this.$tc("classes.gpo.short", gpos.length) + " " + this.$tc("words.loaded.m", gpos.length)).toUpperCase(), type: 'success'}
					)
			})
			.catch(error => {
				console.error(error)
				this.loading = false
				this.error = true
				notificationBus.$emit('createNotification', 
					{message: this.getMessageForCode(error), type: 'error'}
				)
			})
		},
		async fetchGPO(item, isEditable=false, refreshAnim=true){
			return false
			if (refreshAnim == true)
				this.loading = true
			this.fetchingData = true
			this.data.selectedGPO.distinguishedName = item.distinguishedName
			this.data.gpoData = new GPO({})
			await this.data.gpoData.fetch(this.data.selectedGPO.distinguishedName)
			.then(() => {
				this.openDialog('gpoDialog')
				if (isEditable == true)
					this.editableForm = true
				else
					this.editableForm = false
				setTimeout(() => { 
					this.loading = false 
				}, 300);
				this.fetchingData = false
			})
			.catch(error => {
				console.error(error)
				this.loading = false
				this.fetchingData = false
				this.error = true
			})
		},
	}
}
</script>