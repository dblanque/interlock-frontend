<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: NotificationBusContainer.vue -------------------->
<template>
<v-row justify="center">
    <!-- Snackbar -->
    <v-snackbar transition="slide-y-reverse-transition"
      :timeout="-1"
      :top="$vuetify.breakpoint.smAndDown"
      v-model="showSnackbar"
      :class="`transition-snack-color m${$vuetify.breakpoint.mdAndDown ? 't-8' : 'b-12' } ${snackbarTextColor}`"
      :color="snackbarColor"
      >
        <v-icon v-if="snackbarIcon.length > 0" class="mr-1" :color="snackbarTextColor">
            {{ snackbarIcon }}
        </v-icon>

      {{ snackbarMessage.toUpperCase() }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</v-row>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import { notificationBus } from '@/main.js'

export default {
    name: 'NotificationBusContainer',
    mixins: [ validationMixin ],
    data() {
        return {
            showSnackbar: false,
            snackbarMessage: "",
            notificationType: "",
            snackbarColor: 'primary',
            snackbarTextColor: '',
            snackbarIcon: "",
            snackbarTimeout: 10000,
            snackBarTimer: 0
        }
    },
    watch: {
        showSnackbar(newValue) {
            if (newValue != true)
                this.resetSnackbar()
        }
    },
    created() {
        notificationBus.$on('createNotification', (notifObj) => {
            clearTimeout(this.snackBarTimer);
            this.showSnackbar = true
            this.snackbarMessage = notifObj.message
            this.notificationType = notifObj.type
            switch (this.notificationType) {
                case 'alert':
                    this.snackbarColor = 'yellow'
                    this.snackbarIcon = 'mdi-comment-alert-outline'
                    this.snackbarTextColor = 'text-black'
                    break;
                case 'warning':
                    this.snackbarColor = 'orange'
                    this.snackbarIcon = 'mdi-alert-box'
                    break;
                case 'error':
                    this.snackbarColor = 'red'
                    this.snackbarIcon = 'mdi-close-circle-outline'
                    break;
                case 'success':
                    this.snackbarColor = 'green'
                    this.snackbarIcon = 'mdi-checkbox-marked-circle-outline'
                    break;
                case 'info':
                default:
                    this.snackbarColor = 'primary'
                    this.snackbarIcon = 'mdi-information'
                    break;
            }
            if (notifObj.icon)
                this.snackbarIcon = notifObj.icon
            this.snackBarTimer = setTimeout(() => {
                this.showSnackbar = false
            }, this.snackbarTimeout)
        })
    },
    methods: {
        resetSnackbar() {
            setTimeout(() => {
                if (this.showSnackbar != true) {
                    this.snackbarColor = 'primary'
                    this.snackbarTextColor = ""
                    this.snackbarMessage = ""
                }
            }, 300)
        }
    },
}
</script>

<style>
.transition-snack-color .v-snack__wrapper{
    transition: all var(--base-transition-speed-fast-5) ease-in-out;
}
</style>