<template>
    <v-card class="pa-0 ma-0">
        <v-card-title>

        </v-card-title>
        
        <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12" lg="8">
                <v-expansion-panels 
                v-model="userPathExpansionPanel"
                flat 
                hover 
                style="border: 1px solid var(--clr-primary);">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <span>
                                <span>
                                    {{ $t('section.users.createView.userCreatedIn') + ': ' }}
                                </span>
                                <span class="font-weight-bold">
                                    {{ this.userDestination }}
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
                                @update:active="updateUserDestination"
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

        <v-card-actions>
            
        </v-card-actions>
    </v-card>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit'
import { objectRecursiveSearch } from '@/include/utils';

export default {
    data() {
        return {
            userDestination: "",
            userPathExpansionPanel: false,
            ouList: []
        }
    },
    created () {
        this.fetchOUs();
    },
    methods: {
        async fetchOUs(){
            await new OrganizationalUnit({}).list()
            .then(response => {
                this.ouList = response.data.ou_list
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateUserDestination(itemID){
            if (!itemID || itemID.length == 0){
                this.userDestination = "CN=Users," + this.basedn
                console.log('this.userDestination was reset to ' + this.userDestination)
                return this.userDestination
            }
            var itemToUpdate = this.ouList.find(ou => ou.id == itemID)
            var searchResult
            if (itemToUpdate == undefined){
                this.ouList.forEach(ou => {
                    if (!searchResult) {
                        searchResult = objectRecursiveSearch(ou, parseInt(itemID))
                        this.userDestination = searchResult
                    }
                })
            } else if (itemToUpdate.id == itemID)
                this.userDestination = itemToUpdate.dn
            
            this.userPathExpansionPanel = false
        },
    },
}
</script>

<style>
    
</style>