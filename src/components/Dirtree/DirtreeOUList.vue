<template>
<div>
    <v-progress-linear v-if="showLoadingBar" :indeterminate="loading"
    :color="loading ? 'primary' : 'secondary'"/>
    <v-expand-transition>
        <v-treeview v-if="this.ouList.length > 0"
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
    </v-expand-transition>
</div>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit'
import { objectRecursiveSearch } from '@/include/utils';

export default {
    data() {
        return {
            ouList: [],
            objectDestination: "",
            loading: false,
            error: false
        }
    },
    props: {
        baseDn: String,
        excludeObjects: String || Array, // This is to exclude self when moving an OU
        showLoadingBar: {
            type: Boolean,
            default: true
        },  
    },
    created () {
        this.fetchOUs();
    },
    methods: {
        emitDestination(){
            this.$emit('selectedDestination', this.objectDestination)
        },
        updateObjectDestination(itemID){
            if (!itemID || itemID.length == 0){
                this.objectDestination = "CN=Users," + this.baseDn
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

            this.emitDestination()
        },
        async fetchOUs(){
            this.loading = true
            this.error = false
            await new OrganizationalUnit({}).list()
            .then(response => {
                this.ouList = response.data.ou_list
                this.loading = false
            })
            .catch(error => {
                this.loading = false
                this.error = true
                console.log(error)
            })
        },
    },
}
</script>