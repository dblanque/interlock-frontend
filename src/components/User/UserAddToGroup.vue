<template>
<v-card class="pa-2">
    <!-- Title Bar -->
    <v-card-title class="ma-0 pa-0 card-title">
        <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
            <h3 class="pa-0 ma-0 ma-2">
                Add User to Group(s)
            </h3>
            <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
            <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>
        </v-row>
    </v-card-title>
    <v-row class="ma-0 pa-0 px-16 my-3" justify="space-between" align="center">
        <v-col>
            <v-row justify="start">
                <v-chip class="mx-1">
                    <v-icon class="mr-1">
                        mdi-checkbox-blank
                    </v-icon>
                    Contains Groups
                </v-chip>
                <v-chip>
                    <v-icon class="mr-1">
                        mdi-close-box
                    </v-icon>
                    Has no groups
                </v-chip>
            </v-row>
        </v-col>
        <v-col>
            <v-row justify="end">
                <v-btn :disabled="this.ldapList && this.ldapList.length < 1"
                    @click="addGroups" color="primary" class="ma-0 pa-0 mx-2 px-2">
                    <v-icon class="ma-0 pa-0 mr-1">
                        mdi-plus
                    </v-icon>
                    {{ $t('actions.addN') + " " + $t('classes.group.plural') }}
                </v-btn>
                <Refresh
                    :loading="loading"
                    buttonClasses="ma-1 bg-primary"
                    @refresh="fetchLists"
                />
            </v-row>
        </v-col>
    </v-row>

    <v-row class="ma-0 pa-0" justify="center">
        <v-col class="ma-0 pa-0" cols="12" md="10">
            <v-card flat outlined style="max-height: 300px; overflow: auto !important;">
                <v-progress-linear v-if="showLoadingBar" :indeterminate="loading"
                :color="loading ? 'primary' : 'secondary'"/>
                <v-expand-transition>
                    <v-treeview v-if="this.ldapList.length > 0"
                    :items="this.ldapList"
                    dense
                    open-on-click
                    hoverable
                    >
                        <template v-slot:prepend="{ item, open }">
                        <v-row class="mx-1">
                            <v-checkbox
                                :off-icon="(item.type.toLowerCase() != 'group') ? (item.children && item.children.length > 0 ? 'mdi-checkbox-blank':'mdi-close-box') : undefined"
                                :value="selectedGroups.includes(item.id) ? true : false"
                                :disabled="item.type.toLowerCase() != 'group'"
                                @change="changeSelectedStatus(item.id)"
                                @click.stop/>
                            <v-icon :color="open ? 'primary' : undefined" v-if="item.builtin == true && item.type != 'Container'">
                                mdi-hammer
                            </v-icon>
                            <v-icon :color="open ? 'primary' : undefined" v-else-if="item.type == 'Container'">
                                mdi-archive
                            </v-icon>
                            <v-icon :color="open ? 'primary' : undefined" v-else-if="item.type == 'Organizational-Unit'">
                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else>
                                mdi-group
                            </v-icon>
                        </v-row>
                        </template>
                        <template v-slot:label="{item}">
                            <v-row align="start"
                                @click="changeSelectedStatus(item.id)">
                                <v-col cols="11" md="auto">
                                {{ item.name }}
                                </v-col>
                            </v-row>
                        </template>
                    </v-treeview>
                </v-expand-transition>
            </v-card>
        </v-col>
    </v-row>
</v-card>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit'
import Refresh from '@/components/RefreshButton.vue'
import { objectRecursiveSearch } from '@/include/utils';

export default {
    components: {
        Refresh
    },
    data() {
        return {
            ldapList: [],
            selectedGroups: [],
            showLoadingBar: false,
            loading: false,
            filter: {
                "iexact":{
                    "organizationalUnit":{
                        attr: "objectClass",
                        or: true
                    },
                    "container":{
                        attr: "objectClass",
                        or: true
                    },
                    "group":{
                        attr: "objectClass",
                        or: true
                    },
                    "Domain Users*":{
                        attr: "cn",
                        exclude: true
                    }
                }
            }
        }
    },
    props: {
        viewKey: String,
        excludeGroups: Array
    },
    methods: {
        addGroups(){
            var searchResult
            var finalGroupArray = []
            // If there's a Selected Group to Add
            if (this.selectedGroups.length > 0) {
                // Loop for each Group ID
                this.selectedGroups.forEach(groupID => {
                    // Loop for all objects in LDAP List to do a recursive search
                    this.ldapList.forEach(element => {
                        // If a result is not found keep searching
                        if (!searchResult)
                            searchResult = objectRecursiveSearch(element, parseInt(groupID))
                        // Else push it and set the result to undefined for the next object
                        else {
                            finalGroupArray.push(searchResult)
                            searchResult = undefined
                        }
                    });
                });
                // console.log(finalGroupArray)
                this.$emit('addGroups', finalGroupArray)
            }
        },
        changeSelectedStatus(itemID){
            console.log(itemID)
            if (this.selectedGroups.includes(itemID)) {
                this.selectedGroups = this.selectedGroups.filter(e => e != itemID)
            }
            else {
                this.selectedGroups.push(itemID)
            }
        },
        async fetchLists(){
            this.loading = true
            this.error = false
            this.selectedGroups = []
            if (this.excludeGroups != undefined && this.excludeGroups.length > 0) {
                this.excludeGroups.forEach(groupDN => {
                    this.filter['iexact'][groupDN] = {
                        attr: "distinguishedName",
                        exclude: true
                    }
                });
            }
            await new OrganizationalUnit({}).dirtree(this.filter)
            .then(response => {
                this.ldapList = response.data.ou_list
                this.loading = false
                return response
            })
            .catch(error => {
                this.loading = false
                this.error = true
                console.log(error)
                return error
            })
        },
        clearList(){
            this.ldapList = []
        },
        setDestination(destination){
            console.log(destination)
        },
        closeDialog() {
            this.$emit('closeDialog', this.viewKey)
        }
    },
    
}
</script>