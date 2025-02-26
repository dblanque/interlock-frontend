<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: HomeViewContainer.vue ------------------------->
<template>
	<v-row class="justify-space-between d-flex">
		<v-col class="ma-0 pa-0 mx-2">
			<v-card width="100%" height="100%">
				Card 1
			</v-card>
		</v-col>
		<v-col>
			<v-row class="justify-center">
				<v-card width="100%" height="100%">
					Card 2
				</v-card>
			</v-row>
			<v-row class="justify-center mt-6">
				<v-card width="100%" height="100%">
					Card 3
				</v-card>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
	import { notificationBus } from '@/main.js'
	export default {
		name: 'HomeViewContainer',
		props: {
			viewTitle: String,
			snackbarTimeout: Number
		},
	}
</script>