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
    <v-card-actions class="">
        <v-row class="ma-1 pa-0" justify="center">
        <v-btn dark class="ma-2 clr-valid" rounded @click="emitLogoutAction">{{ $t("actions.backToLogin") }}</v-btn>
        <v-btn class="ma-2 text-normal bg-primary" :disabled="!allowRefresh" rounded @click="refreshAccessToken">{{ $t('actions.refreshToken') }}</v-btn>
        </v-row>
    </v-card-actions>
    </v-card>
</template>

<script>
import User from "@/include/User"
import { notificationBus } from '@/main.js'

export default {
    name: 'RefreshTokenDialog',
    data() {
        return {
            timeRemaining: 0,
            timer: "00:00",
            intervalId: 0,
            allowRefresh: true,
            alertType: "info",
            alertIcon: "mdi-information"
        }
    },
    props: {
        countdown: Boolean
    },
    computed: {
        threshold(){
            const time = localStorage.getItem("refresh_token_lifetime")
            return time - (time / 3)
        }
    },
    methods: {
        getTimeInMinutes(){
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining - minutes * 60;
            this.timer = String(String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0'))
        },
        clearCountdown(){
            clearInterval(this.intervalId)
            this.allowRefresh = true
            this.alertType = 'info'
            this.alertIcon = 'mdi-information'
            this.timeRemaining = localStorage.getItem("refresh_token_lifetime") - localStorage.getItem("access_token_lifetime")
        },
        startCountdown(){
            this.clearCountdown()
            this.getTimeInMinutes()
            this.intervalId = setInterval(() => {
                // console.log(this.timeRemaining)
                this.thresholdPassed = this.timeRemaining < this.threshold
                this.alertType = this.thresholdPassed ? 'warning' : 'info'
                this.alertIcon = this.thresholdPassed ? 'mdi-alert-box' :'mdi-information'
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
        async refreshAccessToken(){
            await new User({}).getCurrentUserData()
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