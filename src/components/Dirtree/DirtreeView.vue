<template>
  <v-row justify="center" class="mt-2 mb-2">
    <v-card flat outlined class="pa-2" max-width="1200px">
      <!-- Actions Row -->
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-text-field clearable
          v-model="searchString"
          :label="$t('actions.search')"
          class="mx-2"
        ></v-text-field>
        <v-btn 
          class="mx-2 bg-primary" 
          color="white" 
          icon
          elevation="0"
          :loading="loading"
          @click="fetchDirtree"
          >
          <v-icon>
            mdi-refresh
          </v-icon>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
        <v-btn disabled class="pa-2 mx-2" color="primary" @click="openDialog('userCreate')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') }}
        </v-btn>
      </v-row>
  
      <!-- Item Legends -->
      <v-card flat outlined class="ma-1 pa-2">
        <v-col cols="12">
          <h4>{{ $t('words.legend') }}</h4>
        </v-col>
        <v-row class="px-4 ma-1" justify="center">
          <v-col v-for="(item, key) in itemTypes" :key="item.id" cols="12" md="auto" lg="auto" class="ma-0 pa-0">
            <v-chip v-if="item.show != false" class="mx-2 my-1"
            @click="setFilter(key)"
            :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark" 
            :color="item.filtered == true ? 'primary' : ''">
              <v-icon>
                {{ item.icon }}
              </v-icon>
              <span class="text-overline ml-1">
                {{ $t('classes.' + key + '.single') }}
              </span>
            </v-chip>
          </v-col>
        </v-row>
        <v-progress-linear 
        :indeterminate="loading" size="100" width="7"
        :color="!this.tableData.items.length && this.error == true && !this.loading ? 'red' : 'primary'"/>
      </v-card>
  
      <!-- Tree View -->
      <v-card class="ma-1" flat outlined>
      <v-expand-transition>
            <v-treeview v-if="!loading"
              :items="this.tableData.items"
              dense
              :search="searchString"
              hoverable
              >
              <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.builtin == true">
                    mdi-hammer
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Organizational-Unit'">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Computer'">
                    mdi-monitor
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Person' || item.type == 'User'">
                    mdi-account
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Group'">
                    mdi-google-circles-communities
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
              <template v-slot:append="{item}">
                  <!-- User Buttons -->
                  <span v-if="(item.type == 'User' || item.type=='Person')">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="goToUser(item)"
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>
                            mdi-arrow-right-bold
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.goTo') + ' ' + $t('classes.user.single') }}</span>
                    </v-tooltip>
                  </span>
  
                  <!-- Group Buttons -->
                  <span>
                    <v-tooltip bottom v-if="item.type == 'Group'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn disabled
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>
                            mdi-arrow-right-bold
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.goTo') + ' ' + $t('classes.group.single') }}</span>
                    </v-tooltip>
                  </span>

                  <!-- General Buttons -->
                  <span v-if="item.builtin != true">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            @click="openDialog('dirtreeMove', item)"
                            color="primary"
                            icon
                            v-bind="attrs"
                            v-on="on"
                        >
                          <v-icon>
                            mdi-folder-move
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.move') }}</span>
                    </v-tooltip>
                  </span>
              </template>
            </v-treeview>
      </v-expand-transition>
      <v-fab-transition>
        <v-icon class="ma-12" v-if="!this.tableData.items.length && this.error == true && !this.loading" size="82" color="red">
          mdi-close-circle
        </v-icon>
      </v-fab-transition>
      </v-card>
    </v-card>

    <!-- USER VIEW/EDIT DIALOG -->
    <v-dialog eager max-width="900px" v-model="dialogs['dirtreeMove']">
        <DirtreeMove
            :cnToMove="selectedCn"
            :viewKey="'dirtreeMove'"
            ref="DirtreeMove"
            @closeDialog="closeDialog"
            @save="fetchDirtree"
        />
    </v-dialog>
  </v-row>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit'
import DirtreeMove from '@/components/Dirtree/DirtreeMove.vue';

export default {
    data() {
        return {
            searchString: "",
            selectedCn: "",
            loading: false,
            error: false,
            tableData: {
                headers: [],
                items: []
            },
            dialogs: {
                dirtreeMove: false,
            },
            filters: [],
            itemTypes: {
                "container":{
                    "filtered": false,
                    "icon":"mdi-at"
                },
                "builtin-domain":{
                    "filtered": false,
                    "icon": "mdi-hammer"
                },
                "person":{
                    "filtered": false,
                    "show": false,
                    "icon":"mdi-account"
                },
                "group":{
                    "filtered": false,
                    "icon":"mdi-google-circles-communities"
                },
                "user":{
                    "filtered": false,
                    "icon":"mdi-account"
                },
                "computer":{
                    "filtered": false,
                    "icon":"mdi-monitor"
                },
                "organizational-unit":{
                    "filtered":false,
                    "icon":"mdi-folder"
                },
            },
        }
    },
    components: {
        DirtreeMove
    },
    props: {
        viewTitle: String,
        snackbarTimeout: Number,
        requestRefresh: Boolean
    },
    created () {
        this.fetchDirtree();
    },
    methods: {
        openDialog(key, item){
            this.dialogs[key] = true;
            switch (key) {
                case 'dirtreeMove':
                    this.selectedCn = item.dn
                break;
                default:
                break;
            }
        },
        async closeDialog(key, refresh=false){
            this.dialogs[key] = false;
            if (refresh)
                this.fetchDirtree()
        },
        goToUser(item){
            this.$emit('goToUser', item)
        },
        setFilter(key){
            this.filters = []
            var itemTypeAmount = 0
            this.itemTypes[key].filtered = !this.itemTypes[key].filtered

            for (const type in this.itemTypes) {
                itemTypeAmount += 1
                if (this.itemTypes[type].filtered == true)
                    this.filters.push(type)
            }

            if (key == 'user'){
                itemTypeAmount += 1
                this.itemTypes['person'].filtered = !this.itemTypes['person'].filtered
            }

            if (itemTypeAmount == this.filters.length)
                this.filters = []
            this.fetchDirtree()
            // console.log('Feature not enabled, filter for ' + key.toUpperCase() + ' objects should toggle')
        },
        resetDirtree(){
            this.filters = []
            for (const type in this.itemTypes)
                this.itemTypes[type].filtered = false
            this.fetchDirtree()
        },
        resetSnackbar(){
            this.$emit('resetSnackbar')
        },
        createSnackbar(color, string){
            this.$emit('createSnackbar', color, string)
        },
        // Home (DirTree) View Actions
        async fetchDirtree(){
            this.loading = true
            this.tableData.headers = []
            this.tableData.items = []
            await new OrganizationalUnit({}).dirtree(this.filters)
            .then(response => {
                this.tableData.headers = []
                this.tableData.items = response.data.ou_list
                this.error = false;
                this.loading = false;
                this.resetSnackbar();
                this.createSnackbar('green', (this.$t("category.header.home") + " " + this.$t("words.loaded.single.m")).toUpperCase() )
                setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
            })
            .catch(error => {
                console.log(error)
                this.loading = false;
                this.error = true;
                this.resetSnackbar();
                this.createSnackbar('red', this.$t("error.unableToLoad").toUpperCase() + " " + this.selectedTabTitle.toUpperCase())
                setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
            })
        },
    },
}
</script>
<style>
    
</style>