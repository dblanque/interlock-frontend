<template>
    <v-card class="pa-6">
    <v-card-title>
        <v-row justify="center">
        {{ $t("misc.logoutForbiddenMsg") }}
        </v-row>
    </v-card-title>
    <v-card-text>
        <v-icon class="mt-4" large>mdi-emoticon-sad</v-icon>
    </v-card-text>
    <v-card-actions class="">
        <v-row class="ma-1 pa-0" justify="center">
        <v-btn class="ma-2 clr-valid" rounded @click="emitLogoutAction">{{ $t("actions.back") }}</v-btn>
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