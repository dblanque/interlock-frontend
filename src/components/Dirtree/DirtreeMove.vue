<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: DirtreeMove.vue ---------------------------->
<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("section.dirtree.move.title")}}</h3>
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
                {{ $t('section.dirtree.move.originalRelativePath') + ": " + originalRelativePath }}
            </v-col>
            <v-col cols="12" class="font-weight-medium">
                {{ $t('ldap.attributes.distinguishedName') + ": " + objectDn }}
            </v-col>
        </v-row>

        <v-divider class="mx-16 mt-2"/>

        <v-row class="ma-0 pa-0 mt-4" align="center" justify="space-around">
            <v-btn small text color="primary" class="ma-1" @click="setDestination()">
                {{ $t('section.dirtree.move.setToRoot')}}
            </v-btn>
            <v-btn small
                class="ma-1"
                text
                :disabled="!allowRefresh"
                elevation="0"
                @click="refreshOUList"
                >
                {{ $t('actions.refresh') }}
                <v-icon>
                mdi-refresh
                </v-icon>
                <template v-slot:loader>
                <span class="custom-loader">
                    <v-icon color="white">mdi-cached</v-icon>
                </span>
                </template>
            </v-btn>
        </v-row>

        <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12" lg="10">
                <v-expansion-panels
                v-model="userPathExpansionPanel"
                flat
                hover 
                style="border: 1px solid var(--v-primary-base);">
                    <v-expansion-panel :key="0">
                        <v-expansion-panel-header>
                            <span>
                                <span class="font-weight-bold">
                                    {{ this.objectName }}
                                </span>
                                <span>
                                    {{ " " + $t('section.dirtree.move.willBeMovedTo').toLowerCase() + ': ' }}
                                </span>
                                <span class="font-weight-bold">
                                    {{ this.objectDestination }}
                                </span>
                            </span>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                            <v-card flat outlined style="max-height: 300px; overflow: auto !important;">
                                <DirtreeOUList
                                ref="DirtreeOUList"
                                :fetchOnCreated="false"
                                :excludeObjects="objectDn"
                                @selectedDestination="setDestination"
                                />
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
                        <v-btn elevation="0" @click="confirmMove"
                        @keydown.enter="confirmMove" color="primary"
                        class="ma-0 pa-0 pa-2 ma-1 pr-4" 
                        rounded>
                            <v-icon class="ma-0 mx-1">
                                mdi-folder-move
                            </v-icon>
                            {{ $t("actions.move" )}}
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
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList.vue'
import { getDomainDetails } from '@/include/utils.js';

export default {
    name: 'DirtreeMove',
    components: {
        DirtreeOUList
    },
    data() {
        return {
            objectDestination: "",
            userPathExpansionPanel: 0,
            allowRefresh: true,
            domain: "",
            realm: "",
            basedn: "",
            error: "",
            errorMsg: "",
            filter: {
                "iexact":{}
            }
        }
    },
    props: {
        createMode: {
            type: Boolean,
            default: false
        },
        viewKey: String,
        objectDn: String,
        objectName: String
    },
    computed: {
        originalRelativePath() {
            if (this.objectDn != undefined)
                return this.objectDn.split(',').slice(1).join(',')
            return ""
        }
    },
    methods: {
        resetFilter(){
            this.filter = {
                "iexact":{}
            }
        },
        setExcludeFilter(){
            // 2nd argument is exclude
            if (this.objectDn && this.objectDn != undefined && this.objectDn != null){
                this.filter['iexact']['organizationalUnit'] = 'objectClass'
                this.filter['iexact']['container'] = { attr: 'objectClass', or: true }
                this.filter['iexact'][this.objectDn] = {attr: 'distinguishedName', exclude: true}
            }
        },
        clearList(){
            this.resetFilter()
            this.$refs.DirtreeOUList.clearList()
        },
        async refreshOUList(){
            if (this.allowRefresh == true) {
                this.allowRefresh = false
                this.setExcludeFilter()
                await this.$refs.DirtreeOUList.fetchOUs(this.filter).then(()=>{
                    this.allowRefresh = true
                })
            }
        },
        async resetDialog(){
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            this.allowRefresh = false
            if (this.$refs.DirtreeOUList) {
                this.$nextTick(()=>{
                    this.setDestination();
                    this.setExcludeFilter()
                    this.$refs.DirtreeOUList.fetchOUs(this.filter)
                    .then(() => {
                        this.allowRefresh = true
                    })
                })
            }
            return
        },
        setDestination(destination=undefined){
            // Set default destination if undefined
            if (destination == undefined || !destination)
                this.objectDestination = this.basedn
            // Set destination from arg
            else
                this.objectDestination = destination
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        confirmMove(){
            this.$emit('confirm', this.objectDestination);
        },
    },
}
</script>

<style>
    
</style>