<template>
<div>
	<v-container>
		<v-row>
			<v-btn small color="primary" @click="refreshAction">
				<v-icon color=""> mdi-refresh </v-icon> {{ $t('actions.refresh') }}
			</v-btn>
		</v-row>
	</v-container>
</div>
</template>

<script>
import Debug from '@/include/Debug.js';
export default {
	mounted() {
	},
	methods: {
		refreshAction() {
			console.log("Refresh")
		}
	}
}
</script>