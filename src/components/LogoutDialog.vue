<!------------------ INTERLOCK IS LICENSED UNDER GNU GPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LogoutDialog.vue ---------------------------->
<template>
    <v-card class="pa-6">
    <v-alert type="warning" :icon="false" class="ma-0 pa-6" style="border-radius: 1.25rem !important;">
        <v-icon x-large class="clr-white clr-lig-95 mr-2">
            mdi-alert
        </v-icon>
        <span class="mr-7">
            {{ $t("misc.logoutForbiddenMsg") }}
        </span>
    </v-alert>
    <v-card-actions class="">
        <v-row class="ma-1 pa-0" justify="center">
        <v-btn dark class="ma-2 clr-valid" rounded @click="emitLogoutAction">{{ $t("actions.backToLogin") }}</v-btn>
        <!-- <v-btn class="ma-2 clr-error" rounded @click="showLogoutDialog = false">{{ $t('actions.no') }}</v-btn> -->
        </v-row>
    </v-card-actions>
    </v-card>
</template>

<script>
export default {
    methods: {
        emitLogoutAction() {
            this.$emit('logoutAction')
        }
    },
}
</script>