<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: ApplicationView.vue ------------------------->
<template>
	<v-row>
		VIEW
	</v-row>
</template>

<script>
	import { notificationBus } from '@/main.js'
	export default {
		name: 'ApplicationView',
		props: {
			viewTitle: String,
			snackbarTimeout: Number
		},
	}
</script>