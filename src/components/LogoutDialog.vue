<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LogoutDialog.vue ---------------------------->
<template>
    <v-card class="pa-3">
    <v-row class="ma-0 pa-0">
        <v-col>
            <v-alert dense type="warning" :icon="'mdi-lock-remove'" class="ma-0 pa-6">
                <span class="mr-7">
                    {{ $t("misc.logoutForbiddenMsg").toUpperCase() }}
                </span>
            </v-alert>
        </v-col>
    </v-row>
    <v-card-actions class="">
        <v-row class="ma-1 pa-0 mb-0" justify="center">
        <v-btn dark class="ma-0 clr-valid" rounded @click="emitLogoutAction">{{ $t("actions.backToLogin") }}</v-btn>
        <!-- <v-btn class="ma-2 clr-error" rounded @click="showLogoutDialog = false">{{ $t('actions.no') }}</v-btn> -->
        </v-row>
    </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'LogoutDialog',
    methods: {
        emitLogoutAction() {
            this.$emit('logoutAction')
        }
    },
}
</script>