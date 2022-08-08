<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("section.dirtree.rename.title")}}</h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-row class="ma-0 pa-0 mt-3" justify="center">
            <v-col cols="12" class="font-weight-medium">
                {{ $t('section.dirtree.rename.originalDistinguishedName') + ": " + objectDn }}
            </v-col>
        </v-row>

        <v-divider class="mx-16 mt-2"/>

        <v-row class="ma-0 pa-0 my-4" justify="center">
            <v-col cols="8" md="6">
                <v-text-field
                dense
                @keydown.enter="confirmRename"
                :label="$t('ldap.attributes.name')"
                v-model="newObjectName"
                :rules="[this.fieldRules(newObjectName, 'ge_cn', true)]"
                ></v-text-field>
            </v-col>
        </v-row>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" justify="center">
                <!-- Back and Next buttons -->
                <div>
                    <v-slide-x-reverse-transition>
                        <v-chip class="mx-2" color="red" v-if="this.error && $vuetify.breakpoint.mdAndUp" text-color="white">
                            {{ this.errorMsg }}
                        </v-chip>
                    </v-slide-x-reverse-transition>

                    <v-slide-y-reverse-transition>
                        <v-btn elevation="0" @click="confirmRename"
                        @keydown.enter="confirmRename" color="primary"
                        class="ma-0 pa-0 pa-2 ma-1 pr-4" 
                        rounded>
                            <v-icon class="ma-0 mx-1">
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                            {{ $t("actions.rename" )}}
                        </v-btn>
                    </v-slide-y-reverse-transition>

                    <v-slide-y-reverse-transition>
                        <v-btn elevation="0" @click="closeDialog"
                        @keydown.enter="closeDialog"
                        class="ma-0 pa-0 pa-2 ma-1 pr-4 bg-white bg-slig-25" 
                        rounded>
                            <v-icon class="ma-0 mr-1" color="red">
                                mdi-close-circle
                            </v-icon>
                            <span class="text-white">
                                {{ $t("actions.cancel" )}}
                            </span>
                        </v-btn>
                    </v-slide-y-reverse-transition>
                </div>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin'

export default {
    mixins: [ validationMixin ],
    props: {
        viewKey: String,
        objectDn: String,
        objectName: String
    },
    data() {
        return {
            newObjectName: "",
            error: "",
            errorMsg: "",
        }
    },
    methods: {
        clearData(){
            this.newObjectName = ""
            this.error = ""
            this.errorMsg = ""
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        confirmRename(){
            this.$emit('confirm', this.newObjectName);
        },
    },
}
</script>