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
                {{ $t('section.dirtree.move.originalRelativePath') + ": " + objectDn }}
            </v-col>
        </v-row>

        <v-divider class="mx-16 mt-2"/>

        <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12" lg="10">
                <v-expansion-panels
                v-model="userPathExpansionPanel"
                flat
                hover 
                style="border: 1px solid var(--clr-primary);">
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
                                <v-treeview
                                :items="this.ouList"
                                dense
                                hoverable
                                activatable
                                @update:active="updateObjectDestination"
                                >
                                <template v-slot:prepend="{ item, open }">
                                    <v-icon v-if="item.type == 'Organizational-Unit'">
                                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                                    </v-icon>
                                    <v-icon v-else>
                                        mdi-at
                                    </v-icon>
                                </template>
                                <template v-slot:label="{item}">
                                <v-row align="start">
                                    <v-col cols="11" md="auto">
                                    {{ item.name }}
                                    </v-col>
                                </v-row>
                                </template>
                                </v-treeview>
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
                        <v-btn elevation="0" @click="closeDialog"
                        @keydown.enter="closeDialog" color="primary"
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
import OrganizationalUnit from '@/include/OrganizationalUnit'
import { objectRecursiveSearch, getDomainDetails } from '@/include/utils';

export default {
    data() {
        return {
            objectDestination: "",
            userPathExpansionPanel: 0,
            ouList: [],
            domain: "",
            realm: "",
            basedn: "",
            error: "",
            errorMsg: ""
        }
    },
    props: {
        viewKey: String,
        objectDn: String,
        objectName: String
    },
    watch: {
    },
    created () {
        this.resetDialog()
    },
    methods: {
        resetDialog(){
            this.fetchOUs();
            this.updateObjectDestination();
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        async fetchOUs(){
            await new OrganizationalUnit({}).list()
            .then(response => {
                this.ouList = response.data.ou_list
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateObjectDestination(itemID){
            if (!itemID || itemID.length == 0){
                this.objectDestination = "CN=Users," + this.basedn
                // console.log('this.objectDestination was reset to ' + this.objectDestination)
                return this.objectDestination
            }
            var itemToUpdate = this.ouList.find(ou => ou.id == itemID)
            var searchResult
            if (itemToUpdate == undefined){
                this.ouList.forEach(ou => {
                    if (!searchResult) {
                        searchResult = objectRecursiveSearch(ou, parseInt(itemID))
                        this.objectDestination = searchResult
                    }
                })
            } else if (itemToUpdate.id == itemID)
                this.objectDestination = itemToUpdate.dn
        },
    },
}
</script>

<style>
    
</style>