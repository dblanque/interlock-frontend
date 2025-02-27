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
				mdi-save
			</v-icon>
			</v-btn>
			</template>
			<span>{{ $t('actions.save') }}</span>
		</v-tooltip>

		<v-tooltip bottom>
			<template v-slot:activator="{ on, attrs }">
			<v-btn 
				elevation="0" 
				icon 
				small>
				<v-icon small>
				mdi-delete
				</v-icon>
			</v-btn>
			</template>
			<span>{{ $t('actions.delete') }}</span>
		</v-tooltip>
		</v-row>
	</template>
	</v-data-table>
	</div>
</template>

<script>
	import { notificationBus } from '@/main.js';
	export default {
		name: 'ApplicationView',
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
			}
		}
	}
</script>