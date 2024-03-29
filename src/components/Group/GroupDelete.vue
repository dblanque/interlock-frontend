<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: GroupDelete.vue ----------------------------->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.groups.deleteGroup.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-card-text class="pa-0 ma-0">
            <v-row class="pa-0 ma-8 text-subtitle-1" justify="center">
                {{ $t('section.groups.deleteGroup.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ (groupObject.cn ? groupObject.cn : groupObject.distinguishedName) + "?" }}
                </span>
            </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @keydown.enter="closeDialog(true)" 
                @click="closeDialog(true)"
                class="ma-0 pa-0 pa-2 ma-1"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                rounded>
                    <v-icon class="mr-1" color="green">
                        mdi-checkbox-marked-circle-outline
                    </v-icon>
                    <span class="pr-1">
                        {{ $t("actions.yes" )}}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog"
                class="ma-0 pa-0 pa-2 ma-1"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                rounded>
                    <span class="pl-1">
                        {{ $t("actions.no" )}}
                    </span>
                    <v-icon class="ml-1" color="red">
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import Group from '@/include/Group.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import { notificationBus } from '@/main.js'

export default {
    name: "GroupDelete",
    mixins: [ utilsMixin ],
    props: {
        groupObject: Object,
        viewKey: String
    },
    created() {
    },
    methods: {
        async closeDialog(deleteConfirm=false, group={}) {
            if (group != {}) {
                group.distinguishedName = this.groupObject.distinguishedName
                group.cn = this.groupObject.cn
            }
            if (deleteConfirm == true) {
                await new Group({}).delete({group: group})
                .then(response => {
                    if (response.data.groupname == group.groupname)
                        notificationBus.$emit('createNotification', {
                                message: (this.$tc("classes.group", 1) + " " + this.$tc("words.deleted.m", 1)).toUpperCase(), 
                                type: 'info'
                        });
                    this.$emit('refresh');
                })
                .catch(error => {
                    console.error(error)
                    this.errorMsg = this.getMessageForCode(error)
                    notificationBus.$emit('createNotification', {
                            message: (this.errorMsg).toUpperCase(),
                            type: 'error'
                    });
                })
            }
            this.$emit('closeDialog', this.viewKey);
        },
    }
}
</script>

<style>
.outlined {
    border: thin solid var(--border-d-base);
}

.card-title {
    border-radius: 4px;
    background: var(--v-white-d-base);
    position: sticky !important;
    top: 0 !important;
    z-index: 100;
    border-bottom: thin solid var(--border-d-base);
}

[theme=dark] .card-title {
    background: var(--v-gray-85-base);
}

.card-actions {
    border-radius: 4px;
    background: var(--v-white-d-base);
    position: sticky !important;
    bottom: 0 !important;
    z-index: 100;
    border-top: thin solid var(--border-d-base);
}

[theme=dark] .card-actions {
    background: var(--v-gray-85-base);
}
</style>