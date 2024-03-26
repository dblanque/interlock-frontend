<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: SettingsResetDialog.vue ------------------------->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                    {{ $t('section.settings.resetDialog.header') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-card-text class="pa-0 ma-0 my-8">
            <span class="font-weight-medium" 
            v-html="$t('section.settings.resetDialog.message')">
            </span>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @click="resetConfirm"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-2 ma-1 bg-white bg-lig-25"
                rounded>
                    <v-icon class="mr-2">
                        mdi-checkbox-marked-circle
                    </v-icon>
                    <span class="pr-1">
                        {{ $t("actions.yes" )}}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog"
                class="ma-0 pa-0 pa-2 ma-1" color="primary"
                rounded>
                    <span class="pl-1 text-white">
                        {{ $t("actions.no" )}}
                    </span>
                    <v-icon class="ml-2" color="white">
                        mdi-close-circle
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
export default {
    name: "SettingsResetDialog",
    mixins: [ utilsMixin ],
    methods: {
        async resetConfirm() {
            this.$emit('resetConfirm');
        },
        async closeDialog() {
            this.$emit('closeDialog');
        },
    }
}
</script>