<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: DirtreeView.vue ---------------------------->
<template>
  <v-row justify="center" class="mt-2 mb-2">
    <v-card flat outlined class="pa-2" max-width="1200px" width="90%">
      <!-- Actions Row -->
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-text-field clearable
          v-model="searchString"
          :label="$t('actions.search')"
          class="mx-2"></v-text-field>
        <v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
          <refresh-button dense
            :loading="loading"
            @refresh="fetchDirtree" />
        </v-row>
      </v-row>
      <v-row
        :justify="$vuetify.breakpoint.lgAndUp ? 'end' : 'center'"
        class="ma-0 pa-0 mx-6 mb-4"
        style="position: relative;">
        <v-btn elevation="0" class="pa-2 mx-2 mr-0 pill-start" color="primary"
          @click="openDialog('dirtreeOUCreate')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') + " " + $tc("classes.organizational-unit", 1) }}
        </v-btn>
        <v-menu :close-on-content-click="false" left
          :nudge-left="(($t('actions.addN') + ' ' + $tc('classes.organizational-unit', 1)).length * 2) + 'ch'"
          v-model="actionListOpen" :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)"
          offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"
              style="min-width: 32px;" elevation="0" class="pa-0 px-2 pr-3 pill-end"
              color="primary">
              <v-icon id="floatingActionListButton"
                :class="actionListOpen == true ? 'active' : ''">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-divider class="mx-4" />
            <v-list-item
              class="ma-0 pa-0"
              v-for="(item, index) in actionList"
              :key="index">
              <v-btn
                :disabled="!item.enabled"
                @click="openDialog(item.value)"
                color="primary"
                tile
                text
                style="width: 100%;">
                <v-icon class="mr-1">
                  {{ item.icon }}
                </v-icon>
                {{ getTranslationKey(item).toUpperCase() }}
              </v-btn>
            </v-list-item>
            <v-divider class="mx-4" />
          </v-list>
        </v-menu>
      </v-row>

      <!-- Item Legends -->
      <v-card
        flat
        outlined
        class="ma-1 pa-2">
        <v-row
          :justify="$vuetify.breakpoint.mdAndUp ? 'end' : 'center'"
          class="ma-0 pa-0 my-1"
          align="center">
          <v-btn
            @click="resetDirtree"
            outlined
            small
            color="primary"
            class="ma-0 pa-0 pa-1">
            <v-icon class="ma-0 pa-0 mr-1">
              mdi-filter-remove-outline
            </v-icon>
            {{ $t('actions.resetFilters') }}
          </v-btn>

          <v-btn
            small
            :disabled="!this.tableData.items || this.tableData.items.length < 1"
            outlined
            color="primary"
            @click="toggleOpenAll"
            class="ma-0 pa-0 pa-1 ml-2">
            <v-fab-transition>
              <v-icon
                class="ma-0 pa-0"
                v-if="listOpenAll || dirtreeOpen.length > 0">
                mdi-chevron-double-up
              </v-icon>
              <v-icon
                class="ma-0 pa-0"
                v-else>
                mdi-chevron-double-down
              </v-icon>
            </v-fab-transition>
            {{ listOpenAll || dirtreeOpen.length > 0 ? $t("actions.closeAll") :
              $t("actions.openAll") }}
          </v-btn>

          <v-divider
            v-if="$vuetify.breakpoint.mdAndUp"
            class="mx-4" />

          <v-menu
            offset-y
            left
            nudge-bottom="1rem"
            :close-on-content-click="false"
            v-model="filterListOpen">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" small elevation="0"
                style="min-width: 32px;"
                :class="'pa-0 px-2 pr-1 ' + ($vuetify.breakpoint.smAndDown ? 'mx-2' : '')"
                :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)">
                {{ $t("actions.filter") }}
                <v-icon id="filterListButton" :class="filterListOpen == true ? 'active' : ''">
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <v-list
              dense
              :dark="!isThemeDark($vuetify)"
              :light="isThemeDark($vuetify)">
              <v-list-item>
                <v-btn
                  @click="filterAll"
                  class="mx-1"
                  color="primary">
                  <v-icon>
                    mdi-filter
                  </v-icon>
                  {{ $tc('words.all.m', 1) }}
                </v-btn>
                <v-btn
                  @click="filterNone"
                  class="mx-1">
                  <v-icon>
                    mdi-filter-outline
                  </v-icon>
                  {{ $tc('words.none.m', 1) }}
                </v-btn>
              </v-list-item>
              <v-list-item
                v-for="(item, key) in itemTypes"
                :key="item.id">
                <v-list-item-action class="ma-0 pa-0 mr-2">
                  <v-checkbox
                    :disabled="item.show != false && item.required"
                    @change="setFilter(key, true)"
                    on-icon="mdi-checkbox-blank-off-outline"
                    color="primary"
                    v-model="item.filtered"
                    class="ma-0 pa-0"
                    dense />
                </v-list-item-action>
                <v-list-item-title class="font-weight-medium">
                  <v-row
                    class="ma-0 pa-0"
                    justify="start">
                    <v-icon>
                      {{ item.icon }}
                    </v-icon>
                    <span class="text-overline ml-1">
                      {{ $tc('classes.' + key, 1) }}
                    </span>
                    <v-icon
                      class="ml-1"
                      small
                      v-if="key == 'person' || key == 'user'">
                      mdi-link
                    </v-icon>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <v-progress-linear
          :indeterminate="loading"
          size="100"
          width="7"
          :color="!this.tableData.items.length && this.error == true && !this.loading ? 'red' : 'primary'" />
      </v-card>

      <!-- Tree View -->
      <v-card
        class="ma-1"
        flat
        outlined>
        <v-expand-transition>
          <v-treeview
            v-if="!loading"
            selected-color="primary"
            selection-type="independent"
            dense
            hoverable
            :open.sync="dirtreeOpen"
            item-key="id"
            v-model="dirtreeSelection"
            :items="this.tableData.items"
            :search="searchString"
            ref="dirTreeviewList">
            <!-- ICONS -->
            <template v-slot:prepend="{ item, open }">
              <div
                @click="getObjectIsClickable ? changeOpenStatus(item.id) : undefined"
                :class="getObjectIsClickable(item) + ' '">
                <v-icon
                  v-if="item.builtin == true && item.type != 'container' && item.type != 'computer'"
                  :color="open ? 'primary' : undefined">
                  mdi-hammer
                </v-icon>
                <div v-else-if="item.type == 'container' && item.builtin == true">
                  <v-icon :color="open ? 'primary' : undefined">
                    {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                  </v-icon>
                  <v-icon class="ml-1" small :color="open ? 'primary' : undefined">
                    mdi-hammer
                  </v-icon>
                </div>
                <v-icon v-else-if="item.type == 'container'" :color="open ? 'primary' : undefined">
                  {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                </v-icon>
                <v-icon v-else-if="item.type == 'organizational-unit'"
                  :color="open ? 'primary' : undefined">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else-if="item.type == 'computer'">
                  {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                </v-icon>
                <v-icon
                  v-else-if="(item.type == 'person' || item.type == 'user') && !itemIsContact(item)">
                  {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                </v-icon>
                <v-icon v-else-if="itemIsContact(item)">
                  {{ itemTypes['contact']['icon'] }}
                </v-icon>
                <v-icon v-else-if="item.type == 'group'">
                  {{ itemTypes[item.type.toLowerCase()]['icon'] }}
                </v-icon>
                <v-icon v-else>
                  mdi-group
                </v-icon>
              </div>
            </template>
            <!-- LABEL -->
            <template v-slot:label="{ item }">
              <v-row justify="start"
                @click="getObjectIsClickable ? changeOpenStatus(item.id) : undefined"
                :class="getObjectIsClickable(item) + ' '">
                <v-col cols="auto">
                  {{ item.name }}
                </v-col>
              </v-row>
            </template>
            <!-- ACTIONS -->
            <template v-slot:append="{ item }">
              <!-- user Buttons -->
              <span
                v-if="(item.type == 'user' || item.type == 'person') && validForActions(item.object_class)">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="goToUser(item)"
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on">
                      <v-icon>
                        mdi-arrow-right-bold
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.goTo') + ' ' + $tc('classes.user', 1) }}</span>
                </v-tooltip>
              </span>

              <!-- group Buttons -->
              <span v-else-if="item.type == 'group' && validForActions(item.object_class)">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      @click="goToGroup(item)"
                      v-bind="attrs"
                      v-on="on">
                      <v-icon>
                        mdi-arrow-right-bold
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.goTo') + ' ' + $tc('classes.group', 1) }}</span>
                </v-tooltip>
              </span>

              <!----------------------- General Buttons ----------------------->
              <!-- Move LDAP Object -->
              <span v-if="item.builtin != true">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="validForActions(item.object_class)"
                      @click="openDialog('dirtreeMove', item)"
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on">
                      <v-icon>
                        mdi-folder-move
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.move') }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="validForActions(item.object_class)"
                      @click="openDialog('dirtreeRename', item)"
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on">
                      <v-icon>
                        mdi-rename-box
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('actions.rename') }}</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="validToDelete(item.type)">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="openDialog('dirtreeDeleteObject', item)"
                      :disabled="item.children && item.children.length > 0"
                      color="red"
                      icon
                      v-bind="attrs"
                      v-on="on">
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
          <v-icon
            class="ma-12"
            v-if="!this.tableData.items.length && this.error == true && !this.loading"
            size="82"
            color="red">
            mdi-close-circle
          </v-icon>
        </v-fab-transition>
      </v-card>
    </v-card>

    <!-- CREATE OU DIALOG -->
    <v-dialog
      eager
      max-width="900px"
      v-model="dialogs['dirtreeOUCreate']">
      <DirtreeOUCreate
        :createType="createType"
        :dialogKey="'dirtreeOUCreate'"
        ref="DirtreeOUCreate"
        @closeDialog="closeDialog" />
    </v-dialog>

    <!-- DELETE OBJECT CONFIRM DIALOG -->
    <v-dialog
      eager
      max-width="800px"
      v-model="dialogs['dirtreeDeleteObject']">
      <DirtreeDeleteObject
        :ldapObject="this.selectedObject"
        :dialogKey="'dirtreeDeleteObject'"
        ref="DirtreeDeleteObject"
        @closeDialog="closeDialog"
        @refresh="resetDirtree(true)" />
    </v-dialog>

    <!-- MOVE OBJECT DIALOG -->
    <v-dialog
      eager
      max-width="900px"
      v-model="dialogs['dirtreeMove']">
      <DirtreeMove
        :objectDn="selectedObject.distinguished_name"
        :objectName="selectedObject.name"
        :dialogKey="'dirtreeMove'"
        ref="DirtreeMove"
        @closeDialog="closeDialog"
        @confirm="moveObject" />
    </v-dialog>

    <!-- RENAME OBJECT DIALOG -->
    <v-dialog
      eager
      max-width="900px"
      v-model="dialogs['dirtreeRename']">
      <DirtreeRename
        :objectDn="selectedObject.distinguished_name"
        :objectName="selectedObject.name"
        :dialogKey="'dirtreeRename'"
        ref="DirtreeRename"
        @closeDialog="closeDialog"
        @confirm="renameObject" />
    </v-dialog>
  </v-row>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit.js'
import DirtreeOUCreate from '@/components/Dirtree/DirtreeOUCreate.vue';
import DirtreeMove from '@/components/Dirtree/DirtreeMove.vue';
import DirtreeRename from '@/components/Dirtree/DirtreeRename.vue';
import DirtreeDeleteObject from '@/components/Dirtree/DirtreeDeleteObject.vue';
import RefreshButton from '@/components/RefreshButton.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js'

export default {
  name: 'DirtreeView',
  mixins: [validationMixin, utilsMixin],
  components: {
    DirtreeMove,
    DirtreeRename,
    DirtreeOUCreate,
    DirtreeDeleteObject,
    RefreshButton
  },
  props: {
    viewTitle: String,
    snackbarTimeout: Number
  },
  data() {
    return {
      createType: "ou",
      actionListOpen: false,
      actionList: [
        {
          value: "dirtreecomputerCreate",
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
      filterListOpen: false,
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
        "exclude": {}
      },
      itemTypes: {
        "container": {
          "filtered": false,
          "icon": "mdi-archive",
          "required": false,
        },
        "person": {
          "filtered": false,
          "show": false,
          "icon": "mdi-account"
        },
        "user": {
          "filtered": false,
          "icon": "mdi-account",
          "required": false,
        },
        "contact": {
          "filtered": false,
          "show": true,
          "icon": "mdi-folder-account-outline"
        },
        "group": {
          "filtered": false,
          "icon": "mdi-google-circles-communities",
          "required": false,
        },
        "computer": {
          "filtered": false,
          "icon": "mdi-monitor",
          "required": false,
        },
        // "builtin-domain":{
        //     "filtered": false,
        //     "icon": "mdi-hammer",
        //     "required": true,
        // },
        // "organizational-unit":{
        //     "filtered":false,
        //     "icon":"mdi-folder",
        //     "required": true,
        // },
      },
    }
  },
  created() {
    this.fetchDirtree();
  },
  watch: {
    'dialogs': {
      handler: function (newValue) {
        if (!newValue['dirtreeMove'] || newValue['dirtreeMove'] == false)
          this.$refs.DirtreeMove.clearList(this.selectedObject.distinguished_name);
      },
      deep: true
    }
  },
  methods: {
    itemIsContact(item) {
      if (!item) return false
      if (!item.object_class) return false
      if (!Array.isArray(item.object_class)) return false
      return item.object_class.includes('contact')
    },
    createSnackbar(notifObj) {
      notificationBus.$emit('createNotification', notifObj);
    },
    validToDelete(itemType) {
      switch (itemType.toLowerCase()) {
        case 'organizational-unit':
        case 'computer':
        case 'printer':
          return true
        default:
          return false
      }
    },
    validForActions(itemObjectClasses) {
      if (itemObjectClasses != undefined)
        if (itemObjectClasses.includes('contact'))
          return false
      return true
    },
    getTranslationKey(o) {
      var key = o.value
      switch (key) {
        case "dirtreeOUCreate":
          return this.$t("actions.addN") + " " + this.$tc("classes.organizational-unit", 1)
        case "dirtreeMove":
          return this.$t("actions.move") + " " + this.$tc("classes.ldap", 1)
        case "dirtreePrinterCreate":
          return this.$t("actions.addN") + " " + this.$tc("classes.printer", 1)
        case "dirtreecomputerCreate":
          return this.$t("actions.addN") + " " + this.$tc("classes.computer", 1)
        case "dirtreeDelete":
          return this.$t("actions.delete") + " " + this.$tc("classes.ldap", 1)
        default:
          return "No Translation Key"
      }
    },
    resetSearch() {
      this.searchString = ""
    },
    toggleOpenAll() {
      this.listOpenAll = !this.listOpenAll
      if (this.dirtreeOpen.length > 0)
        this.listOpenAll = false
      if (this.$refs.dirTreeviewList != undefined)
        this.$refs.dirTreeviewList.updateAll(this.listOpenAll)
    },
    changeOpenStatus(itemId) {
      if (this.dirtreeOpen.includes(itemId))
        this.dirtreeOpen = this.dirtreeOpen.filter(e => e !== itemId)
      else
        this.dirtreeOpen.push(itemId)
    },
    async moveObject(destination) {
      this.loading = true;
      this.dialogs['dirtreeMove'] = false
      this.selectedObject.destination = destination
      await new OrganizationalUnit({}).move({ ldapObject: this.selectedObject })
        .then(() => {
          this.error = false;
          this.loading = false;
          this.resetDirtree(true)
          this.createSnackbar({ message: this.$t("section.dirtree.move.success").toUpperCase(), type: 'success' })
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.error = true
          this.errorMsg = this.getMessageForCode(error)
          this.createSnackbar({ message: this.errorMsg.toUpperCase(), type: 'error' })
        })
    },
    async renameObject(newRDN) {
      this.loading = true;
      this.dialogs['dirtreeRename'] = false
      this.selectedObject.newRDN = newRDN
      await new OrganizationalUnit({}).rename({ ldapObject: this.selectedObject })
        .then(() => {
          this.error = false;
          this.loading = false;
          this.resetDirtree(true)
          this.createSnackbar({ message: this.$t("section.dirtree.rename.success").toUpperCase(), type: 'success' })
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.error = true
          this.errorMsg = this.getMessageForCode(error)
          this.createSnackbar({ message: this.errorMsg.toUpperCase(), type: 'error' })
        })
    },
    openDialog(key, item) {
      this.dialogs[key] = true;
      this.selectedObject = {}
      switch (key) {
        case 'dirtreeMove':
          this.createFlag = false
          this.selectedObject = item
          if (this.$refs.DirtreeMove != undefined)
            this.$refs.DirtreeMove.resetDialog(this.selectedObject.distinguished_name);
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
        case 'dirtreecomputerCreate':
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
    async closeDialog(key, refresh = false) {
      this.dialogs[key] = false;
      if (refresh)
        this.fetchDirtree()
    },
    goToUser(item) {
      this.$emit('goToUser', item)
    },
    goToGroup(item) {
      this.$emit('goToGroup', item)
    },
    filterAll() {
      for (const i in this.itemTypes) {
        this.itemTypes[i].filtered = true
      }
      this.buildFilter()
    },
    filterNone() {
      for (const i in this.itemTypes) {
        this.itemTypes[i].filtered = false
      }
      this.buildFilter()
    },
    buildFilter() {
      if (!this.filters) {
        this.filters = { 'exclude': {} }
        return this.fetchDirtree()
      }
      this.filters['exclude']['objectClass'] = []
      let objectClassFilter = this.filters['exclude']['objectClass']
      for (const i in this.itemTypes) {
        if (this.itemTypes[i].filtered == true)
          objectClassFilter.push(i)
        else {
          if (objectClassFilter.indexOf(i) >= 0)
            objectClassFilter.splice(objectClassFilter.indexOf(i), 1)
        }
      }
      if (objectClassFilter.length == 0)
        delete this.filters['exclude']['objectClass']
      return this.fetchDirtree()
    },
    setFilter(key, build_filter = false) {
      const filter_status = this.itemTypes[key].filtered
      switch (key) {
        case 'user':
        case 'person':
          this.itemTypes['person'].filtered = filter_status
          this.itemTypes['user'].filtered = filter_status
          break;
        default:
          this.itemTypes[key].filtered = filter_status
          break;
      }
      if (build_filter)
        this.buildFilter()
      // console.log('Feature not enabled, filter for ' + key.toUpperCase() + ' objects should toggle')
    },
    getObjectIsClickable(item) {
      if (Array.isArray(item.children) && item.children.length > 0)
        return 'clickable'
      else
        return 'notclickable'
    },
    resetDirtree(forceReload = false) {
      this.filters = { 'exclude': {} }
      var filterReset = false
      var value
      for (const type in this.itemTypes) {
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
    // DirTree View Actions
    async fetchDirtree() {
      this.loading = true
      this.tableData.headers = []
      this.tableData.items = []
      await new OrganizationalUnit({}).dirtree(this.filters)
        .then(response => {
          this.tableData.headers = []
          this.tableData.items = response.data.ldapObjectList
          this.error = false;
          this.loading = false;
          this.createSnackbar({ message: (this.$t("category.header.ldap-dirtree") + " " + this.$tc("words.loaded.m", 1)).toUpperCase(), type: 'success' })
        })
        .catch(error => {
          console.error(error)
          this.loading = false;
          this.error = true;
          this.createSnackbar({ message: this.getMessageForCode(error), type: 'error' })
        })
      this.$emit('done')
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

#floatingActionListButton.active {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>