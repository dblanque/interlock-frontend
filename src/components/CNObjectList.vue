<template>
<v-card class="pa-2" flat>
    <!-- Title Bar -->
    <v-card-title class="ma-0 pa-0 card-title" v-if="showHeader">
        <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
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
                    {{ $t("section.users.userDialog.containsGroups") }}
                </v-chip>
                <v-chip>
                    <v-icon class="mr-1">
                        mdi-close-box
                    </v-icon>
                    {{ $t("section.users.userDialog.doesNotContainGroups") }}
                </v-chip>
            </v-row>
        </v-col>
        <v-col>
            <v-row justify="end">
                <v-btn  :disabled="!this.ldapList || this.ldapList.length < 1"
                text color="primary" @click="toggleOpenAll">
                    <v-fab-transition>
                    <v-icon v-if="listOpenAll">
                        mdi-chevron-double-up
                    </v-icon>
                    <v-icon v-else>
                        mdi-chevron-double-down
                    </v-icon>
                    </v-fab-transition>
                    {{ listOpenAll ? $t("actions.closeAll") : $t("actions.openAll") }}
                </v-btn>
                <v-btn :disabled="this.ldapList && this.ldapList.length < 1" v-if="addButton"
                    @click="addDNs" color="primary" class="ma-0 pa-0 mx-2 px-2">
                    <v-icon class="ma-0 pa-0 mr-1">
                        mdi-plus
                    </v-icon>
                    {{ $t('actions.addN') }}
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
            <v-card flat outlined style="max-height: 560px; overflow: auto !important;">
                <v-progress-linear v-if="showLoadingBar" :indeterminate="loading"
                :color="loading ? 'primary' : 'secondary'"/>
                <v-expand-transition>
                    <v-treeview v-if="this.ldapList.length > 0"
                    :open-all="this.listOpenAll"
                    :items="this.ldapList"
                    dense
                    ref="groupTreeview"
                    open-on-click
                    hoverable
                    >
                        <template v-slot:prepend="{ item, open }">
                        <v-row class="mx-1">
                            <v-checkbox
                                :off-icon="(!isTypeValid(item.type.toLowerCase())) ? (item.children && item.children.length > 0 ? 'mdi-checkbox-blank':'mdi-close-box') : undefined"
                                :value="selectedDNs.includes(item.id) ? true : false"
                                :disabled="!isTypeValid(item.type.toLowerCase())"
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
                            <v-icon v-if="isUserType(item.type)">
                                mdi-account
                            </v-icon>
                            <v-icon v-else-if="item.type.toLowerCase() == 'group'">
                                mdi-google-circles-communities
                            </v-icon>
                            <v-icon v-else>
                                mdi-group
                            </v-icon>
                        </v-row>
                        </template>
                        <template v-slot:label="{item}">
                            <v-row align="start"
                                @click="isTypeValid(item.type.toLowerCase()) ? changeSelectedStatus(item.id) : undefined">
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
            userClasses: ['user','person','organizationalperson'],
            ldapList: [],
            selectedDNs: [],
            showLoadingBar: false,
            loading: false,
            listOpenAll: false,
            openItems: [],
            filter: {
                "iexact":{
                    "organizationalUnit":{
                        attr: "objectClass",
                        or: true
                    },
                    "container":{
                        attr: "objectClass",
                        or: true
                    }
                }
            }
        }
    },
    props: {
        viewKey: String,
        excludeDNs: Array,
        enableGroups: {
            type: Boolean,
            default: true
        },
        enableUsers: {
            type: Boolean,
            default: true
        },
        addButton: {
            type: Boolean,
            default: true
        },
        openAllButton: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        isUserType(itemObjectClass){
            console.log(itemObjectClass)
            var isUser = false
            if (this.userClasses.includes(itemObjectClass.toLowerCase()))
                isUser = true
            return isUser
        },
        toggleOpenAll(){
            this.listOpenAll = !this.listOpenAll
            if (this.$refs.groupTreeview != undefined)
                this.$refs.groupTreeview.updateAll(this.listOpenAll)
        },
        addDNs(){
            var searchResult
            var finalGroupArray = []
            // If there's a Selected Group to Add
            if (this.selectedDNs.length > 0) {
                // Loop for each Group ID
                this.selectedDNs.forEach(groupID => {
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
                this.$emit('addDNs', finalGroupArray)
            }
        },
        changeSelectedStatus(itemID){
            if (this.selectedDNs.includes(itemID)) {
                this.selectedDNs = this.selectedDNs.filter(e => e != itemID)
            }
            else {
                this.selectedDNs.push(itemID)
            }
        },
        isTypeValid(type){
            var types = [
                'user',
                'person',
                'organizationalperson',
                'group'
            ]
            if (types.includes(type))
                return true
            return false
        },
        async fetchLists(){
            if (this.enableGroups) {
                this.filter['iexact']['group'] = {
                    attr: "objectClass",
                    or: true

                }
            } else delete this.filter['iexact']['group']
            if (this.enableUsers) {
                this.filter['iexact']['user'] = {
                    attr: "objectClass",
                    or: true
                }
            } else delete this.filter['iexact']['user']
            this.loading = true
            this.error = false
            this.selectedDNs = []
            if (this.excludeDNs != undefined && this.excludeDNs.length > 0) {
                this.excludeDNs.forEach(distinguishedName => {
                    this.filter['iexact'][distinguishedName] = {
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