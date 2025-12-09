<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LogoutDialog.vue ---------------------------->
<template>
	<v-card class="pa-3">
		<v-row class="ma-0 pa-0">
			<v-col>
				<v-alert dense
					:type="alertType"
					:icon="alertIcon"
					class="ma-0 pa-6">
					<span class="mr-7">
						{{ $t("misc.actionRequired").toUpperCase() }}
					</span>
				</v-alert>
			</v-col>
		</v-row>
		<v-row class="ma-0 pa-0">
			<v-col>
				<span>
					{{ $t("misc.refreshTokenTimer") + " " + timer }}
				</span>
			</v-col>
		</v-row>
		<v-row cols="12" class="ma-0 pa-0" justify="center">
			<v-checkbox class="ma-0 pa-0"
				v-model="enableRefreshValue"
				hide-details
				:label="`${$t('userAccountDropdown.auto_refresh_token')} ${enableRefreshValue ? $t('words.enabled') : $t('words.disabled')}`" />
		</v-row>
		<v-card-actions class="">
			<v-row class="ma-1 pa-0" justify="center">
				<v-btn
					dark
					color="valid-35-s"
					class="ma-2"
					rounded
					@click="emitLogoutAction">
					{{ $t("actions.backToLogin") }}
				</v-btn>
				<v-btn
					color="primary"
					class="ma-2"
					:disabled="!allowRefresh"
					rounded
					@click="refreshAccessToken">
					{{ $t('actions.refreshToken') }}
				</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import User from "@/include/User";
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';

export default {
	name: 'RefreshTokenDialog',
	mixins: [utilsMixin],
	data() {
		return {
			timeRemaining: 0,
			timer: "00:00",
			intervalId: 0,
			allowRefresh: true,
			alertType: "info",
			alertIcon: "mdi-information",
			enableRefreshValue: false,
		}
	},
	props: {
		countdown: Boolean
	},
	computed: {
		threshold() {
			const refreshClock = Date.parse(localStorage.getItem("auth.refresh_clock"));
			const accessClockLimit = localStorage.getItem("auth.access_expire");
			return (accessClockLimit - refreshClock) / 1000
		}
	},
	methods: {
		setAutoRefresh() {
			let v = localStorage.getItem('auth.auto_refresh_token') === 'true'
			if (this.enableRefreshValue === true && v !== true)
				localStorage.setItem('auth.auto_refresh_token', true)
		},
		getTimeInMinutes() {
			const minutes = Math.floor(this.timeRemaining / 60);
			const seconds = Math.floor(this.timeRemaining - minutes * 60);
			this.timer = String(String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0'))
		},
		clearCountdown() {
			clearInterval(this.intervalId)
			this.allowRefresh = true
			this.enableRefreshValue = localStorage.getItem('auth.auto_refresh_token') === 'true'
			this.alertType = 'info'
			this.alertIcon = 'mdi-information'
			const accessClockLimit = localStorage.getItem("auth.access_expire") / 1000;
			const refreshClockLimit = localStorage.getItem("auth.refresh_expire") / 1000;
			this.timeRemaining = refreshClockLimit - accessClockLimit
		},
		startCountdown() {
			this.clearCountdown()
			this.getTimeInMinutes()
			this.intervalId = setInterval(() => {
				this.thresholdPassed = this.timeRemaining < this.threshold
				this.alertType = this.thresholdPassed ? 'warning' : 'info'
				this.alertIcon = this.thresholdPassed ? 'mdi-alert-box' : 'mdi-information'
				if (this.timeRemaining > 0)
					this.timeRemaining -= 1
				if (this.timeRemaining < 2)
					this.allowRefresh = false
				if (this.timeRemaining < 1)
					this.clearCountdown()
				this.getTimeInMinutes()
			}, 1000)
		},
		emitLogoutAction() {
			this.$emit('logoutAction')
		},
		async refreshAccessToken() {
			this.setAutoRefresh()
			await new User({}).selfInfo()
				.then(() => {
					notificationBus.$emit('createNotification', {
						message: this.$t("misc.tokenRefreshed").toUpperCase(),
						type: 'success'
					});
					this.$emit('closeDialog')
					this.clearCountdown()
				})
				.catch((error) => {
					console.error(error)
				})
		}
	},
}
</script>