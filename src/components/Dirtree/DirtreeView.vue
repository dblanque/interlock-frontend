<template>
  <v-row justify="center" class="mt-2 mb-2">
    <v-card flat outlined class="pa-2" max-width="1200px">
      <!-- Actions Row -->
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-col class="ma-0 my-4 pa-0">
        <v-text-field clearable
          v-model="searchString"
          :label="$t('actions.search')"
          class="mx-2"
        ></v-text-field>
        </v-col>
        
        <v-col cols="auto" class="ma-0 my-4 pa-0">
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
        <v-btn disabled class="pa-2 mx-2" color="primary" @click="openDialog('')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') }}
        </v-btn>
        </v-col>
      </v-row>
  
      <!-- Item Legends -->
      <v-card flat outlined class="ma-1 pa-2">
        <v-col cols="12">
          <h4>{{ $t('words.legend') }}</h4>
        </v-col>
        <v-row :justify="$vuetify.breakpoint.mdAndUp ? 'end': 'center'" class="mx-7 my-2" align="center">
          <v-alert color="secondary" class="ma-0" type="info" dense rounded="xl">
            {{ $t("section.dirtree.filterHint") }}
          </v-alert>
          <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
          <v-btn @click="resetDirtree"
          outlined rounded color="primary" class="ma-0 pa-0 px-3">
            <v-icon class="mr-1">
              mdi-filter-remove-outline
            </v-icon>
            {{ $t('actions.resetFilters') }}
          </v-btn>
        </v-row>
        <v-row class="px-4 ma-1" justify="center">
          <v-col v-for="(item, key) in itemTypes" :key="item.id" cols="12" md="auto" lg="auto" class="ma-0 pa-0">
            <v-chip v-if="item.show != false && !item.required" class="mx-2 my-1"
            :id="'legend-'+key"
            :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark" 
            :color="item.filtered == true ? 'secondary' : 'primary'"
            @click="setFilter(key)"
            >
              <v-icon>
                {{ item.icon }}
              </v-icon>
              <span class="text-overline ml-1">
                {{ $t('classes.' + key + '.single') }}
              </span>
            </v-chip>
            <v-chip v-else-if="item.show != false && item.required" class="mx-2 my-1"
            :light="!$vuetify.theme.dark" :dark="$vuetify.theme.dark"
            >
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
          selected-color="primary"
          selection-type="independent"
          dense
          hoverable
          :open.sync="dirtreeOpen"
          item-key="id"
          v-model="dirtreeSelection"
          :items="this.tableData.items"
          :search="searchString"
          >
          <!-- ICONS -->
          <template v-slot:prepend="{ item, open }">
            <div @click="getObjectIsClickable ? changeOpenStatus(item.id) : undefined" :class="getObjectIsClickable(item) + ' '">
              <v-icon v-if="item.builtin == true && item.type != 'Container' && item.type != 'Computer'" :color="open ? 'primary' : undefined">
                mdi-hammer
              </v-icon>
              <div v-else-if="item.type == 'Container' && item.builtin == true">
                <v-icon :color="open ? 'primary' : undefined">
                  {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                </v-icon>
                <v-icon class="ml-1" small :color="open ? 'primary' : undefined">
                  mdi-hammer
                </v-icon>
              </div>
              <v-icon v-else-if="item.type == 'Container'" :color="open ? 'primary' : undefined">
                {{ itemTypes[item.type.toLowerCase()]['icon'] }}
              </v-icon>
              <v-icon v-else-if="item.type == 'Organizational-Unit'" :color="open ? 'primary' : undefined">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else-if="item.type == 'Computer'">
                {{ itemTypes[item.type.toLowerCase()]['icon'] }}
              </v-icon>
              <v-icon v-else-if="item.type == 'Person' || item.type == 'User'">
                {{ itemTypes[item.type.toLowerCase()]['icon'] }}
              </v-icon>
              <v-icon v-else-if="item.type == 'Group'">
                {{ itemTypes[item.type.toLowerCase()]['icon'] }}
              </v-icon>
              <v-icon v-else>
                mdi-group
              </v-icon>
            </div>
          </template>
          <!-- LABEL -->
          <template v-slot:label="{ item }">
          <v-row align="start" @click="getObjectIsClickable ? changeOpenStatus(item.id) : undefined" :class="getObjectIsClickable(item) + ' '">
            <v-col cols="11" md="auto">
              {{ item.name }}
            </v-col>
          </v-row>
          </template>
          <!-- ACTIONS -->
          <template v-slot:append="{ item }">
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
              <span v-else-if="item.type == 'Group'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      @click="goToGroup(item)"
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
                <v-tooltip bottom v-if="item.type.toLowerCase() == 'organizational-unit'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        :disabled="item.children && item.children.length > 0"
                        color="red"
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.delete') }}</span>
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
            :objectDn="selectedObject.dn"
            :objectName="selectedObject.name"
            :viewKey="'dirtreeMove'"
            ref="DirtreeMove"
            @closeDialog="closeDialog"
            @confirmMove="moveObject"
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
            selectedObject: {},
            loading: false,
            error: false,
            dirtreeSelection: [],
            forceReload: false,
            dirtreeOpen: [],
            tableData: {
                headers: [],
                items: []
            },
            dialogs: {
                dirtreeMove: false,
            },
            filters: {
              "exclude":{}
            },
            itemTypes: {
                "container":{
                    "filtered": false,
                    "icon":"mdi-archive",
                    "required": false,
                },
                "builtin-domain":{
                    "filtered": false,
                    "icon": "mdi-hammer",
                    "required": true,
                },
                "person":{
                    "filtered": false,
                    "show": false,
                    "icon":"mdi-account"
                },
                "group":{
                    "filtered": false,
                    "icon":"mdi-google-circles-communities",
                    "required": false,
                },
                "user":{
                    "filtered": false,
                    "icon":"mdi-account",
                    "required": false,
                },
                "computer":{
                    "filtered": false,
                    "icon":"mdi-monitor",
                    "required": false,
                },
                "organizational-unit":{
                    "filtered":false,
                    "icon":"mdi-folder",
                    "required": true,
                },
            },
        }
    },
    components: {
        DirtreeMove
    },
    props: {
        viewTitle: String,
        snackbarTimeout: Number
    },
    created() {
      this.fetchDirtree();
    },
    watch: {
      // dirtreeSelection(newValue, oldValue) {
      //   console.log(oldValue)
      //   console.log(newValue)
      // },
      // dirtreeOpen(newValue, oldValue) {
      //   console.log(oldValue)
      //   console.log(newValue)
      // },
      'dialogs': {
          handler: function (newValue) {
            if (!newValue['dirtreeMove'] || newValue['dirtreeMove'] == false)
              this.$refs.DirtreeMove.clearList(this.selectedObject.dn);
          },
          deep: true
      }
    },
    methods: {
        changeOpenStatus(itemId){
          if (this.dirtreeOpen.includes(itemId))
            this.dirtreeOpen = this.dirtreeOpen.filter(e => e !== itemId)
          else
            this.dirtreeOpen.push(itemId)
        },
        moveObject(destination){
          console.log(destination)
          this.dialogs['dirtreeMove'] = false
        },
        openDialog(key, item){
            this.dialogs[key] = true;
            switch (key) {
                case 'dirtreeMove':
                    this.selectedObject = item
                    this.$refs.DirtreeMove.resetDialog(this.selectedObject.dn);
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
        goToGroup(item){
            this.$emit('goToGroup', item)
        },
        setFilter(key){
            this.filters = {
              'exclude':{}
            }
            var itemTypeAmount = 0
            this.itemTypes[key].filtered = !this.itemTypes[key].filtered

            if (key == 'user'){
                itemTypeAmount += 2
                this.itemTypes['person'].filtered = !this.itemTypes['person'].filtered
                this.filters['exclude']['organizationalPerson'] = 'objectClass'
            }

            for (const type in this.itemTypes) {
                itemTypeAmount += 1
                if (this.itemTypes[type].filtered == true){
                  if (type.includes('-')) {
                    var typeToSend = type.split('-')
                    if (typeToSend.length > 2)
                      console.log('Warning, filter typeToSend has more than 2 words in it ( ' + type + ' )')
                    typeToSend = typeToSend[0].toLowerCase() + typeToSend[1].charAt(0).toUpperCase() + typeToSend[1].slice(1)
                  }
                  else {
                    typeToSend = type
                  }
                  this.filters['exclude'][typeToSend] = 'objectClass'
                  
                }
            }

            if (itemTypeAmount == this.filters.length)
              this.filters = {  
                'exclude':{}
              }
            this.fetchDirtree()
            // console.log('Feature not enabled, filter for ' + key.toUpperCase() + ' objects should toggle')
        },
        getObjectIsClickable(item){
          if (Array.isArray(item.children) && item.children.length > 0)
            return 'clickable'
          else
            return
        },
        resetDirtree(forceReload=false){
            this.filters = {}
            var filterReset = false
            var value
            for (const type in this.itemTypes){
              value = this.itemTypes[type].filtered
              if (value == true) {
                this.itemTypes[type].filtered = false
                filterReset = true
              }
            }
            if (filterReset == true || forceReload == true)
              this.fetchDirtree()
              this.forceReload = false
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
.clickable {
  cursor: pointer !important;
}
</style>