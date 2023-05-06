<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: UserImport.vue ------------------------>

<!-- TODO
Allow to Choose field association
Allow to use placeholder password (if no placeholder then require column)

Choose target OU for bulk import

username
password
email
fname
lname
initials
webpage
-->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-progress-linear :color="error == true ? 'red' : 'primary'" :indeterminate="loading"/>
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                    {{ $t('section.users.import.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
            <v-tabs class="ma-0 pa-0" v-model="import_tab" :key="import_tab"
            ref="importTabs"
            centered grow>
                <v-tabs-slider/>
                <v-tab :key="0">{{ $t("section.users.import.importOptions") }}</v-tab>
                <v-tab :disabled="import_tab < 1" :key="1">{{ $t("section.users.import.uploadFile") }}</v-tab>
                <v-tab :disabled="import_tab < 2" :key="2">{{ $t("section.users.import.previewData") }}</v-tab>
            </v-tabs>
        </v-card-title>

        <v-card-text class="pa-0 ma-0">
            <v-tabs-items v-model="import_tab">
                <v-tab-item :key="0">
                    <v-row class="ma-0 pa-0 mt-4" align="center" justify="space-around">
                        <v-btn small text color="primary" class="ma-1" @click="userDestination = basedn">
                            {{ $t('section.dirtree.move.setToRoot')}}
                        </v-btn>
                        <v-btn small
                            class="ma-1"
                            text
                            :disabled="!allowRefresh"
                            elevation="0"
                            @click="fetchOUs(true)"
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
                                                    {{ $t('section.users.userCreate.userCreatedIn') + ': ' }}
                                                </span>
                                                <span class="font-weight-bold">
                                                    {{ this.userDestination }}
                                                </span>
                                            </span>
                                        </v-expansion-panel-header>

                                        <v-expansion-panel-content>
                                            <v-card flat outlined style="max-height: 300px; overflow: auto !important;">
                                                <!-- Dirtree OU List Component -->
                                                <DirtreeOUList
                                                ref="DirtreeOUList"
                                                @selectedDestination="setDestination"
                                                />
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                        </v-col>
                    </v-row>

                    <v-row class="ma-0 pa-0 mb-2" justify="center">
                        <v-btn @click="downloadTemplate"
                        class="ma-0 pa-0 pa-2 ma-1 bg-primary text-white">
                            <v-icon class="mr-1">
                                mdi-download
                            </v-icon>
                            <span class="pr-1">
                                {{ $t("section.users.import.downloadTemplate") }}
                            </span>
                        </v-btn>
                        <v-btn @click="showUserMappings = !showUserMappings"
                        class="ma-0 pa-0 pa-2 ma-1 bg-primary text-white">
                            <v-icon class="mr-1">
                                mdi-cog
                            </v-icon>
                            <span class="pr-1">
                                {{ $t("section.users.import.editUserMappings") }}
                            </span>
                        </v-btn>
                    </v-row>
                    <v-row class="ma-0 pa-0 mb-2" justify="center">
                        <v-col class="ma-0 pa-0" cols="12" md="6">
                            <v-form ref="importPlaceholderPassword" @submit.prevent>
                                <v-checkbox 
                                @change="resetPlaceholderPassword"
                                v-model="usePlaceholderPassword" 
                                :label="$t('section.users.import.usePlaceholderPassword')"/>
                                <v-expand-transition>
                                    <v-text-field v-show="usePlaceholderPassword"
                                    ref="importPlaceholderPasswordField"
                                    :type="passwordHidden ? 'password' : 'text'"
                                    :required="usePlaceholderPassword"
                                    @keydown.enter="nextStep"
                                    :append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="() => (passwordHidden = !passwordHidden)"
                                    dense
                                    :label="$t('ldap.attributes.password')"
                                    v-model="placeholderPassword"
                                    :rules="[this.fieldRules(placeholderPassword, 'ge_password', usePlaceholderPassword ? true : false)]"
                                    ></v-text-field>
                                </v-expand-transition>
                            </v-form>
                        </v-col>
                    </v-row>
                    <v-expand-transition>
                        <v-row justify="center" class="pa-0 ma-0 mb-4"
                        v-show="showUserMappings">
                            <ObjectEditor :value="this.import_fields"
                            :label="$t('section.users.import.dataMapping')"
                            ref="importFieldsEditor"
                            dense
                            resettable
                            disableAddDelete
                            :keyReadonly="true"
                            :required="true"
                            :deletableFields="deletableFields"
                            :disabledFields="usePlaceholderPassword ? ['password'] : []"
                            @reset="setDefaultImportFields"
                            @update="d => this.import_fields = d"/>
                        </v-row>
                    </v-expand-transition>
                </v-tab-item>

                <v-tab-item :key="1">
                    <v-row class="ma-0 pa-0" justify="center">
                        <v-col cols="6">
                            <v-file-input :label="$t('section.users.import.fileToUpload')"
                                outlined
                                @change="previewFile"
                                v-model="inputFile"
                                clearable
                                prepend-icon=""
                                prepend-inner-icon="mdi-upload"
                                show-size
                                class="ma-0 pa-0"
                                accept=".csv,.tsv,.txt"/>
                            <v-progress-linear
                            :indeterminate="this.loading"
                            class="ma-0 pa-0 my-1"/>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0 pa-0" justify="center">
                        <v-alert type="warning" dense>
                            <span v-html="$t('section.users.import.supportedExtensions')"/>
                        </v-alert>
                    </v-row>
                </v-tab-item>

                <v-tab-item :key="2">
                    <v-row class="pa-0 ma-0" justify="center">
                        <v-alert class="ma-4" icon="mdi-alert-box" dense type="warning" close-icon="text-uppercase">
                            {{ $t("section.users.import.previewMode").toUpperCase() }}
                        </v-alert>
                    </v-row>
                    <v-row class="pa-0 ma-0" justify="center">
                        <v-data-table
                            :headers="this.tableData.headers"
                            :items="this.tableData.items"
                            :loading="this.loading"
                            :footer-props="{
                            'items-per-page-options': [10, 25, 50, 100, -1]
                            }"
                            class="py-3 px-2 mt-2 mb-2">
                        </v-data-table>
                    </v-row>
                </v-tab-item>
            </v-tabs-items>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @click="import_tab < 1 ? closeDialog() : import_tab -= 1"
                class="ma-0 pa-0 pa-2 ma-1 bg-secondary text-normal"
                rounded>
                    <v-icon class="mr-1" color="white">
                        {{ import_tab < 1 ? 'mdi-close-circle' : 'mdi-chevron-left' }}
                    </v-icon>
                    <span class="pr-1 text-white">
                        {{ import_tab < 1 ? $t("actions.close") : $t("actions.back") }}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog(true)" 
                :disabled="loading || !json_loaded || error"
                v-show="import_tab > 1"
                class="ma-0 pa-0 pa-2 ma-1" color="primary"
                rounded>
                    <v-icon class="mr-1">
                        mdi-check-circle
                    </v-icon>
                    <span class="pr-1">
                        {{ $t("actions.import") + " " + $t("classes.user.plural")}}
                    </span>
                </v-btn>
                <v-btn @click="nextStep" v-show="import_tab < 2"
                :disabled="!isStepValid()"
                class="ma-0 pa-0 pa-2 ma-1 bg-secondary"
                rounded>
                    <span class="pl-2 text-normal">
                        {{ $t("actions.next") }}
                    </span>
                    <v-icon :class="'clr-primary' + (!isStepValid() ? ' clr-sat-0 clr-lig-90' : '')">
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';
import utilsMixin from '@/plugins/mixin/utilsMixin';
import csvMixin from '@/plugins/mixin/csvMixin';
import CSV from '@/include/csv';
import { notificationBus } from '@/main.js'
import User from '@/include/User'
import { getDomainDetails } from '@/include/utils';
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList'
import ObjectEditor from '@/components/Settings/ObjectEditor'

export default {
    name: "userImport",
    mixins: [
        validationMixin,
        utilsMixin,
        csvMixin
    ],
    data () {
      return {
        loading: false,
        error: false,
        errorMsg: "",
        inputFile: null,
        json_result: {},
        json_loaded: false,
        status_color: 'blue',
        allowRefresh: true,
        deletableFields: [
            "initials",
            "telephoneNumber",
            "webpage",
            "streetAddress",
            "postalCode",
            "l",
            "st",
            "co"
        ],
        showUserMappings: false,
        userPathExpansionPanel: false,
        import_tab: 0,
        import_fields: {},
        usePlaceholderPassword: false,
        placeholderPassword: "",
        passwordHidden: true,
        userDestination: '',
        tableData: {
            headers: [],
            items: []
        }
      }
    },
    props: {
        userObject: Object,
        viewKey: String
    },
    mounted() {
        this.setDefaultImportFields()
    },
    components: {
        DirtreeOUList,
        ObjectEditor
    },
    watch: {
        usePlaceholderPassword(new_value){
            if (new_value == true)
                delete this.import_fields['password'];
            else {
                let keyValues = Object.entries(this.import_fields); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
                keyValues.splice(1,0, ["password","password"]); // insert key value at the index you want like 1.
                this.import_fields = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}
            }

            this.$refs.importFieldsEditor.setObject()
        }
    },
    methods: {
        isStepValid(){
            switch (this.import_tab) {
                case 0:
                    if (this.userDestination.length == 0 || !this.userDestination)
                        return false
                    break;
                case 1:
                    if (!this.json_loaded || this.json_result == false || this.error)
                        return false
                    break;
            }
            return true
        },
        nextStep(){
            switch (this.import_tab + 1) {
                case 1:
                    if (this.usePlaceholderPassword && this.$refs.importPlaceholderPassword.validate())
                            this.import_tab += 1
                    else if (!this.usePlaceholderPassword)
                        this.import_tab += 1
                    break;
                default:
                    this.import_tab += 1
                    break;
            }
        },
        resetPlaceholderPassword(){
            this.placeholderPassword = ""
            this.passwordHidden = true
            this.$refs.importPlaceholderPasswordField.reset()
        },
        getLocalUserImportHeaders(){
            var v = []
            for (const key in this.import_fields)
                v.push(this.import_fields[key])
            return v
        },
        // TODO - Check newline validation
        downloadTemplate(){
            const t_headers = this.getLocalUserImportHeaders()
            CSV.export(
                t_headers,
                [],
                "ilck_user_import_template"
            )
        },
        refreshDataTable(){
            this.tableData.headers = []
            for (let i = 0; i < this.json_result.headers.length; i++) {
                this.tableData.headers.push({
                    text: this.json_result.headers[i],
                    align: 'center',
                    value: this.json_result.headers[i],
                })
            }
            this.tableData.items = this.json_result.data
        },
        clearDataTable(){
            this.tableData.headers = []
            this.tableData.items = []
        },
        async previewFile(file){
            if (!file) {
                if (!this.json_result.length) {
                    this.clearData()
                    notificationBus.$emit('createNotification', { 
                        message: this.$t("section.users.import.fileCleared"), 
                        type: 'info'
                    });
                }
                return
            }

            this.loading = true
            const t_headers = this.getLocalUserImportHeaders()

            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = async (event) => {
                // notificationBus.$emit('send', {type: "success", text:"File Uploaded Successfully!"});
                var csv_file = event.target.result
                csv_file = csv_file.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
                var csv_delimiter = CSV.guessDelimiters(csv_file, [",","\t"])

                this.json_result = await this.csvToJSON(csv_file, csv_delimiter)

                // Validate headers
                if (this.json_result.headers[0] != t_headers[0] || this.json_result.headers.slice[-1] != t_headers.slice[-1])
                    this.json_result = false

                if (this.json_result == false) {
                    this.error = true
                    this.loading = false
                    notificationBus.$emit('createNotification', { 
                        message: this.getMessageForCode('ERR_INVALID_CSV'), 
                        type: 'error'
                    });
                    this.clearDataTable()
                } else {
                    this.error = false
                    notificationBus.$emit('createNotification', { 
                        message: this.$t("section.users.import.fileReady"), 
                        type: 'success'
                    });
                    this.refreshDataTable()
                }
                this.json_loaded = true
            }
            reader.onerror = (event) => {
                console.log(event)
                this.error = true
                this.loading = false
                notificationBus.$emit('createNotification', { 
                    message: this.getMessageForCode('ERR_FILEREADER'), 
                    type: 'error'
                });
                this.clearDataTable()
            }

            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        clearData(){
            this.loading = false
            this.error = false
            this.errorMsg = false
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            this.fetchOUs()
            this.clearDataTable()
            this.inputFile = null
            this.userDestination = "CN=Users," + this.basedn
            this.json_result = {}
            this.json_loaded = false
            this.import_tab = 0
            this.usePlaceholderPassword = false
            this.passwordHidden = true
            this.placeholderPassword = ""
            this.setDefaultImportFields()
            this.resetPlaceholderPassword()
            this.$refs.importTabs.callSlider()
            this.showUserMappings = false
        },
        setDefaultImportFields(){
            this.import_fields = {
                "username":"username",
                "password":"password",
                "mail":"email",
                "givenName":"first_name",
                "sn":"last_name",
                "initials":"initials",
                "telephoneNumber":"phone_number",
                "webpage":"wWWHomePage",
                "streetAddress":"street_address",
                "postalCode":"postal_code",
                "l":"town",
                "st":"state_province",
                "co":"country"
            }
        },
        async fetchOUs(refresh=false){
            if (refresh == true)
                this.userPathExpansionPanel = 0
            if (this.$refs.DirtreeOUList != undefined) {
                this.allowRefresh = false
                this.$nextTick(()=>{
                    if (refresh != true)
                        this.setDestination()
                    this.$refs.DirtreeOUList.fetchOUs()
                    .then(() => {
                        setTimeout(()=>{
                            this.allowRefresh = true
                        }, 50)
                    })
                })
            }
        },
        setDestination(destination=undefined){
            // Set default destination if undefined
            if (destination == undefined || !destination) {
                this.userDestination = this.basedn
                this.userPathExpansionPanel = 0
            }
            // Set destination from arg
            else {
                this.userDestination = destination
                this.userPathExpansionPanel = false
            }
        },
        async closeDialog(importConfirm=false) {
            if(importConfirm != true){
                this.$emit('closeDialog', this.viewKey);
                return
            }

            this.loading = true
            await new User({}).bulkInsert({
                headers: this.json_result.headers,
                placeholder_password: this.placeholderPassword,
                mapping: this.import_fields,
                users: this.json_result.data
            })
            .then(response => {
                setTimeout(() => {
                    this.loading = false
                }, 100)
                this.error = false
                this.errorMsg = ""
                if (response.data.success == true)
                    notificationBus.$emit('createNotification', {
                        message: this.$t('section.users.import.bulkImportSuccess'),
                        type: "success"
                    });
                this.$emit('closeDialog', this.viewKey, true);
            })
            .catch(error => {
                setTimeout(() => {
                    this.loading = false
                }, 100)
                this.error = true
                this.errorMsg = this.getResponseErrorCode(error)
                this.errorMsg = this.getMessageForCode(this.errorMsg).toUpperCase()
                notificationBus.$emit('createNotification', {
                    message: this.errorMsg,
                    type: "error"
                });
            })
        },
    }
}
</script>