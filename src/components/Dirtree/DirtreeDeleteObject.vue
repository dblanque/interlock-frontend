<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!---------------------- File: DirtreeDeleteObject.vue ------------------------>
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.dirtree.deleteObject.title') }}
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
                {{ $t('section.dirtree.deleteObject.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ ldapObject.distinguishedName + "?" }}
                </span>
            </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @keydown.enter="closeDialog(true)"
                @click="closeDialog(true)"
                color="gray-20"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-2 ma-1" 
                rounded>
                    <v-icon class="mr-1" color="green">
                        mdi-checkbox-marked-circle-outline
                    </v-icon>
                    <span class="pr-1">
                        {{ $t("actions.yes" )}}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog"
                color="gray-20"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-2 ma-1" 
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
import OrganizationalUnit from '@/include/OrganizationalUnit.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
    name: "DirtreeDeleteObject",
    mixins: [ utilsMixin ],
    props: {
        ldapObject: Object,
        viewKey: String
    },
    created() {
    },
    methods: {
        async closeDialog(deleteConfirm=false, ou={}) {
            if (ou != {}) {
                ou.distinguishedName = this.ldapObject.distinguishedName
                ou.name = this.ldapObject.name
            }
            if (deleteConfirm == true) {
                await new OrganizationalUnit({}).delete(ou)
                .then(response => {
                    // if (response.data.distinguishedName == ou.distinguishedName)
                    //     console.log("LDAP Object Deleted Successfully")
                    this.$emit('refresh');
                })
                .catch(error => {
                    console.error(error)
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
    position: sticky !important;
    bottom: 0 !important;
    z-index: 100;
    border-top: thin solid var(--border-d-base);
}

[theme=dark] .card-actions {
    background: var(--v-gray-85-base) !important;
}
</style>