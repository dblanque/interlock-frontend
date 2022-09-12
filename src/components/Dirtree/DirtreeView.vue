<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: DirtreeView.vue ---------------------------->
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
        <v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
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
        </v-row>
      </v-row>
      <v-row justify="center" justify-lg="end" class="ma-0 pa-0 mx-6 mb-4" style="position: relative;">
        <v-btn elevation="0" rounded class="pa-2 mx-2 mr-0 pill-start" color="primary" @click="openDialog('dirtreeOUCreate')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') + " " + $t("classes.organizational-unit.single") }}
        </v-btn>
        <v-menu :close-on-content-click="false" left
        :nudge-left="(($t('actions.addN') + ' ' + $t('classes.organizational-unit.single')).length * 2)+'ch'"
        v-model="actionListOpen" :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"
            style="min-width: 32px;" elevation="0" rounded class="pa-0 px-2 pr-3 pill-end" color="primary">
              <v-icon id="floatingActionListButton" :class="actionListOpen == true  ? 'active' : ''">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-divider class="mx-4"/>
            <v-list-item class="ma-0 pa-0"
              v-for="(item, index) in actionList"
              :key="index"
            >
            <v-btn :disabled="!item.enabled" @click="openDialog(item.value)" color="primary" tile text style="width: 100%;">
              <v-icon class="mr-1">
                {{ item.icon }}
              </v-icon>
              {{ getTranslationKey(item).toUpperCase() }}
            </v-btn>
            </v-list-item>
            <v-divider class="mx-4"/>
          </v-list>
        </v-menu>
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
          
          <v-btn rounded :disabled="!this.tableData.items || this.tableData.items.length < 1"
          outlined color="primary" @click="toggleOpenAll" class="ml-2">
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
          ref="dirTreeviewList"
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
              <v-icon v-else-if="(item.type == 'Person' || item.type == 'User') && !item.objectClass.includes('contact')">
                {{ itemTypes[item.type.toLowerCase()]['icon'] }}
              </v-icon>
              <v-icon v-else-if="item.objectClass.includes('contact')">
                {{ itemTypes['contact']['icon'] }}
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
              <span v-if="(item.type == 'User' || item.type=='Person') && validForActions(item.objectClass)">
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
              <span v-else-if="item.type == 'Group' && validForActions(item.objectClass)">
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

              <!----------------------- General Buttons ----------------------->
              <!-- Move LDAP Object -->
              <span v-if="item.builtin != true">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="validForActions(item.objectClass)"
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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="validForActions(item.objectClass)"
                        @click="openDialog('dirtreeRename', item)"
                        color="primary"
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon>
                        mdi-rename-box
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.rename') }}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="validToDelete(item.type)">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="openDialog('dirtreeDeleteObject', item)"
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

    <!-- CREATE OU DIALOG -->
    <v-dialog eager max-width="900px" v-model="dialogs['dirtreeOUCreate']">
        <DirtreeOUCreate
          :createType="createType"
          :viewKey="'dirtreeOUCreate'"
          ref="DirtreeOUCreate"
          @closeDialog="closeDialog"
        />
    </v-dialog>

    <!-- DELETE OBJECT CONFIRM DIALOG -->
    <v-dialog eager max-width="800px" v-model="dialogs['dirtreeDeleteObject']">
      <DirtreeDeleteObject
        :ldapObject="this.selectedObject"
        :viewKey="'dirtreeDeleteObject'"
        ref="DirtreeDeleteObject"
        @closeDialog="closeDialog"
        @refresh="resetDirtree(true)"
      />
    </v-dialog>
    
    <!-- MOVE OBJECT DIALOG -->
    <v-dialog eager max-width="900px" v-model="dialogs['dirtreeMove']">
        <DirtreeMove
            :objectDn="selectedObject.distinguishedName"
            :objectName="selectedObject.name"
            :viewKey="'dirtreeMove'"
            ref="DirtreeMove"
            @closeDialog="closeDialog"
            @confirm="moveObject"
        />
    </v-dialog>
    
    <!-- RENAME OBJECT DIALOG -->
    <v-dialog eager max-width="900px" v-model="dialogs['dirtreeRename']">
        <DirtreeRename
            :objectDn="selectedObject.distinguishedName"
            :objectName="selectedObject.name"
            :viewKey="'dirtreeRename'"
            ref="DirtreeRename"
            @closeDialog="closeDialog"
            @confirm="renameObject"
        />
    </v-dialog>
  </v-row>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit'
import DirtreeOUCreate from '@/components/Dirtree/DirtreeOUCreate.vue';
import DirtreeMove from '@/components/Dirtree/DirtreeMove.vue';
import DirtreeRename from '@/components/Dirtree/DirtreeRename.vue';
import DirtreeDeleteObject from '@/components/Dirtree/DirtreeDeleteObject.vue';
import validationMixin from '@/plugins/mixin/validationMixin';
import utilsMixin from '@/plugins/mixin/utilsMixin';
import { notificationBus } from '@/main.js'

export default {
    mixins: [ validationMixin, utilsMixin ],
    components: {
        DirtreeMove,
        DirtreeRename,
        DirtreeOUCreate,
        DirtreeDeleteObject
    },
    props: {
        viewTitle: String,
        snackbarTimeout: Number
    },
    data() {
        return {
            createType: "ou",
            actionListOpen: false,
            actionList:[
              {
                value: "dirtreeComputerCreate",
                icon: "mdi-monitor",
                enabled: true
              },
              {
                value: "dirtreePrinterCreate",
                icon: "mdi-printer",
                enabled: false
              }
            ],
            searchString: "",
            selectedObject: {},
            loading: false,
            error: false,
            dirtreeSelection: [],
            forceReload: false,
            dirtreeOpen: [],
            listOpenAll: false,
            tableData: {
                headers: [],
                items: []
            },
            dialogs: {
                dirtreeOUCreate: false,
                dirtreeMove: false,
                dirtreeRename: false,
                dirtreeDeleteObject: false,
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
                "contact":{
                    "filtered": false,
                    "show": true,
                    "icon":"mdi-folder-account-outline"
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
              this.$refs.DirtreeMove.clearList(this.selectedObject.distinguishedName);
          },
          deep: true
      }
    },
    methods: {
        createSnackbar(notifObj){
          notificationBus.$emit('createNotification', notifObj);
        },
        validToDelete(itemType){
          switch (itemType.toLowerCase()) {
            case 'organizational-unit':
            case 'computer':
            case 'printer':
              return true
            default:
              return false
          }
        },
        validForActions(itemObjectClasses){
          if (itemObjectClasses != undefined)
            if (itemObjectClasses.includes('contact'))
              return false
          return true
        },
        getTranslationKey(o){
          var key = o.value
          switch (key) {
            case "dirtreeOUCreate":
              return this.$t("actions.addN") + " " + this.$t("classes.organizational-unit.single")
            case "dirtreeMove":
              return this.$t("actions.move") + " " + this.$t("classes.ldap.single")
            case "dirtreePrinterCreate":
              return this.$t("actions.addN") + " " + this.$t("classes.printer.single")
            case "dirtreeComputerCreate":
              return this.$t("actions.addN") + " " + this.$t("classes.computer.single")
            case "dirtreeDelete":
              return this.$t("actions.delete") + " " + this.$t("classes.ldap.single")
            default:
              return "No Translation Key"
          }
        },
        resetSearch(){
          this.searchString = ""
        },
        toggleOpenAll(){
            this.listOpenAll = !this.listOpenAll
            if (this.$refs.dirTreeviewList != undefined)
                this.$refs.dirTreeviewList.updateAll(this.listOpenAll)
        },
        changeOpenStatus(itemId){
          if (this.dirtreeOpen.includes(itemId))
            this.dirtreeOpen = this.dirtreeOpen.filter(e => e !== itemId)
          else
            this.dirtreeOpen.push(itemId)
        },
        async moveObject(destination){
          this.loading = true;
          this.dialogs['dirtreeMove'] = false
          this.selectedObject.destination = destination
          await new OrganizationalUnit({}).move({ldapObject: this.selectedObject})
          .then(() => {
                this.error = false;
                this.loading = false;
                this.resetDirtree(true)
                this.createSnackbar({message: this.$t("section.dirtree.move.success").toUpperCase(), type: 'success'})
          })
          .catch(error => {
                console.log(error)
                this.loading = false
                this.error = true
                this.errorMsg = this.getMessageForCode(error)
                this.createSnackbar({message: this.errorMsg.toUpperCase(), type: 'error'})
          })
        },
        async renameObject(newRDN){
          this.loading = true;
          this.dialogs['dirtreeRename'] = false
          this.selectedObject.newRDN = newRDN
          await new OrganizationalUnit({}).rename({ldapObject: this.selectedObject})
          .then(() => {
                this.error = false;
                this.loading = false;
                this.resetDirtree(true)
                this.createSnackbar({message: this.$t("section.dirtree.rename.success").toUpperCase(), type: 'success'})
          })
          .catch(error => {
                console.log(error)
                this.loading = false
                this.error = true
                this.errorMsg = this.getMessageForCode(error)
                this.createSnackbar({message: this.errorMsg.toUpperCase(), type: 'error'})
          })
        },
        openDialog(key, item){
            this.dialogs[key] = true;
            this.selectedObject = {}
            switch (key) {
                case 'dirtreeMove':
                    this.createFlag = false
                    this.selectedObject = item
                    if (this.$refs.DirtreeMove != undefined)
                      this.$refs.DirtreeMove.resetDialog(this.selectedObject.distinguishedName);
                break;
                case 'dirtreeRename':
                    this.selectedObject = item
                    if (this.$refs.DirtreeRename != undefined)
                      this.$refs.DirtreeRename.clearData();
                break;
                case 'dirtreeOUCreate':
                  this.createType = 'ou'
                  if (this.$refs.DirtreeOUCreate != undefined) {
                    this.$refs.DirtreeOUCreate.newOU();
                    this.$refs.DirtreeOUCreate.resetDialog();
                  }
                break;
                case 'dirtreeComputerCreate':
                  this.dialogs['dirtreeOUCreate'] = true;
                  this.createType = 'computer'
                  if (this.$refs.DirtreeOUCreate != undefined) {
                    this.$refs.DirtreeOUCreate.newOU();
                    this.$refs.DirtreeOUCreate.resetDialog();
                  }
                break;
                case 'dirtreePrinterCreate':
                  this.dialogs['dirtreeOUCreate'] = true;
                  this.createType = 'printer'
                  if (this.$refs.DirtreeOUCreate != undefined) {
                    this.$refs.DirtreeOUCreate.newOU();
                    this.$refs.DirtreeOUCreate.resetDialog();
                  }
                break;
                case 'dirtreeDeleteObject':
                  this.selectedObject = item
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
            return 'notclickable'
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
        // Home (DirTree) View Actions
        async fetchDirtree(){
            this.loading = true
            this.tableData.headers = []
            this.tableData.items = []
            await new OrganizationalUnit({}).dirtree(this.filters)
            .then(response => {
                this.tableData.headers = []
                this.tableData.items = response.data.ldapObjectList
                this.error = false;
                this.loading = false;
                this.createSnackbar({message: (this.$t("category.header.home") + " " + this.$t("words.loaded.single.m")).toUpperCase(), type: 'success'})
            })
            .catch(error => {
                console.log(error)
                this.loading = false;
                this.error = true;
                this.createSnackbar({message: this.getMessageForCode(error), type: 'error'})
            })
        },
    },
}
</script>
<style>
.clickable {
  cursor: pointer !important;
}

.notclickable {
  cursor: default
}

#floatingActionListButton.active{
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>