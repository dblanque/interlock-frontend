<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserBulkUpdate.vue ------------------------------>
<template>
    <v-card class="pa-0 ma-0">
        <v-progress-linear :indeterminate="loading" :color="loadingColor"/>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.users.userBulkUpdate.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>
        <v-stepper v-model="stage">
            <!-- Steps -->
                <v-stepper-header class="px-16">
                    <!-- Basics -->
                    <v-stepper-step :complete="stage > 1" step="1">Data</v-stepper-step>
                    <v-divider class="mx-3" :style="stage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
                    <v-stepper-step :complete="stage > 2" step="2">Summary</v-stepper-step>
                </v-stepper-header>

                <v-slide-y-transition>
                    <v-stepper-items v-show="showStepper">
                        <v-stepper-content step="1">
                            <v-row justify="center" class="ma-0 pa-0 pa-4">
                                <v-col cols="12" md="6" :class="'pa-0 ma-0' + colMarginsR">
                                    <v-card height="100%" flat outlined>
                                        <ObjectEditor
                                            allow-empty-fields
                                            dense
                                            @update="updateFields"
                                            resettable
                                            :value="userFields"
                                            :value-choices="choicesFields"
                                            :key-choices="getKeyChoiceFields()"
                                            @reset="setDefaultFields()"
                                        />
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="6" :class="'pa-0 ma-0' + colMarginsL">
                                    <UserPermissionList
                                        ref="UserBulkUpdatePermissionList"
                                        :permissions="permissions"
                                        @update="onClickPermission"
                                        edit-flag
                                        content-class="ma-0 pa-0"
                                        hide-sidebar/>
                                </v-col>
                            </v-row>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-row class="px-12" justify="center" align="center">
                                <v-list class="my-1" nav width="100%" v-show="showModifiedAttributes">
                                    <!-- Title -->
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title class="font-weight-bold">
                                                {{ $t(`section.users.userBulkUpdate.modifiedAttributes`) }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <!-- Attributes to be applied -->
                                    <v-list-item v-for="v, k in userFields" :key="k">
                                        <v-row justify="space-around">
                                            <v-col class="ma-0 pa-0" cols="12">
                                            <v-divider class="mb-2"/>
                                            </v-col>
                                            <v-col class="mx-2">
                                                {{ $t(`attribute.ldap.${k}`) }}
                                            </v-col>
                                            <v-col class="mx-2">
                                                <v-icon color="primary">
                                                    mdi-arrow-right-thin
                                                </v-icon>
                                            </v-col>
                                            <v-col class="mx-2">
                                                {{ v }}
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                    <v-col class="ma-0 pa-0">
                                    <v-divider class="mx-2"/>
                                    </v-col>
                                </v-list>
                                <v-list class="my-1" nav width="100%" v-if="getEnabledPermissions(permissions).length >= 1">
                                    <!-- Title -->
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title class="font-weight-bold">
                                                {{ $t(`section.users.perms`) }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <!-- Permissions to be applied -->
                                    <v-list-item v-for="k in getEnabledPermissions(permissions)" :key="k">
                                        <v-col class="ma-0 pa-0">
                                        <v-divider class="mb-2"/>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ $t(`section.users.permissions.${k}`) }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                        </v-col>
                                    </v-list-item>
                                    <v-col class="ma-0 pa-0">
                                    <v-divider class="mx-2"/>
                                    </v-col>
                                </v-list>
                            </v-row>                
                        </v-stepper-content>
                    </v-stepper-items>
                </v-slide-y-transition>
        </v-stepper>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" 
                align="center" 
                align-content="center" 
                :justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'space-between'">
                <v-row align="center"
                    :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
                    class="ma-0 pa-0">
                <!-- Save & Close Users Changes Button -->
                    <v-btn @click="stage++" v-show="stage==1"
                    :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
                    class='ma-0 pa-0 pa-4 ma-1'
                    rounded>
                        {{ $t("actions.next") }}
                        <v-icon class="ml-1">
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>
                <!-- Go Back Button -->
                    <v-btn @click="stage--" v-show="stage>=2"
                    :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
                    class='ma-0 pa-0 pa-4 ma-1'
                    rounded>
                        <v-icon class="ml-1">
                            mdi-chevron-left
                        </v-icon>
                        {{ $t("actions.back") }}
                    </v-btn>
                <!-- Save & Close Users Changes Button -->
                    <v-btn @click="saveUsers(true)" v-show="stage==2"
                    color="primary"
                    class='ma-0 pa-0 pa-4 ma-1'
                    rounded>
                        <v-icon class="mr-1">
                            mdi-exit-to-app
                        </v-icon>
                        {{ $t("actions.saveClose") }}
                    </v-btn>
                </v-row>
            </v-row>
        </v-card-actions>
	</v-card>
</template>

<script>
import ldap_perm_json_raw from '@/include/ldap_permissions.json';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import ObjectEditor from '../Settings/ObjectEditor.vue';
import UserPermissionList from './UserPermissionList.vue';
import User from '@/include/User.js';
import { notificationBus } from '@/main.js';
import { getDomainDetails } from '@/include/utils.js';

export default {
    name: "UserBulkUpdate",
	mixins: [ utilsMixin, validationMixin ],
    computed: {
        colMarginsL(){
            if (this.$vuetify.breakpoint.mdAndUp) return ' pl-2'
            return ' mt-4'
        },
        colMarginsR(){
            if (this.$vuetify.breakpoint.mdAndUp) return ' pr-2'
            return ''
        },
    },
    components: {
        ObjectEditor,
        UserPermissionList
    },
	props: {
        selectedUsers: Array,
        viewKey: String,
	},
	data() {
		return {
            showStepper: false,
            stage: 1,
            showModifiedAttributes: false,
            userFields: {},
            permissions: {},
            choicesFields: {},
            loading: false,
            loadingColor: 'primary',
		}
	},
    created(){
        this.setDefaultFields()
    },
    watch: {
    },
	methods: {
        init(){
            console.log(`Init: ${this.$options.name}`)
            setTimeout(()=>{
                this.showStepper = true
            }, 150)
            this.setDefaultFields()
            this.setDefaultPerms()
            this.stage = 1
        },
        exit(){
            this.showStepper = false
        },
        updateFields(v){
            this.userFields = v
            this.setModifiedAttributes()
        },
        setModifiedAttributes(){
            if (this.userFields == undefined) return this.showModifiedAttributes = false
            if (Object.keys(this.userFields).length <= 0) return this.showModifiedAttributes = false
            return this.showModifiedAttributes = true
        },
        getDefaultFields(){
            return {
                "givenName":{
                    text_i18n: "attribute.ldap.givenName",
                    value: ""
                },
                "sn":{
                    text_i18n: "attribute.ldap.sn",
                    value: ""
                },
                "telephoneNumber":{
                    text_i18n: "attribute.ldap.telephoneNumber",
                    value: ""
                },
                "streetAddress":{
                    text_i18n: "attribute.ldap.streetAddress",
                    value: ""
                },
                "postalCode":{
                    text_i18n: "attribute.ldap.postalCode",
                    value: ""
                },
                "l":{
                    text_i18n: "attribute.ldap.l",
                    value: ""
                },
                "st":{
                    text_i18n: "attribute.ldap.st",
                    value: ""
                },
                "co":{
                    text_i18n: "attribute.ldap.co",
                    value: ""
                },
                "wWWHomePage":{
                    text_i18n: "attribute.ldap.wWWHomePage",
                    value: ""
                },
            }
        },
        setDefaultFields(){
            this.userFields = {}
            this.choicesFields = {
                "co": {
                    values: this.getCountryList(),
                    type: "autocomplete"
                }
            }
        },
        setDefaultPerms(){
            this.permissions = structuredClone(ldap_perm_json_raw.permissions)
            this.permissions["LDAP_UF_NORMAL_ACCOUNT"].value = true
        },
        getKeyChoiceFields() {
            let r = []
            let defaultFields = this.getDefaultFields()
            Object.keys(defaultFields).forEach(k => {
                defaultFields[k].value = k
                r.push(defaultFields[k])
            })
            return r
        },
        // When a permission in the v-list changes this function is executed
        onClickPermission(key){
            this.permissions[key].value = !this.permissions[key].value
        },
        async saveUsers(){
            this.loading = true;
            let domainDetails = getDomainDetails()
            Object.filter = (obj, predicate) => 
                Object.keys(obj)
                    .filter( key => predicate(obj[key]) )
                    .reduce( (res, key) => (res[key] = obj[key], res), {} );
            let filteredFields = Object.filter(this.userFields, v => v.length > 0)
            let filteredPerms = Object.filter(this.permissions, v => v.value === true)
            filteredPerms = Object.keys(filteredPerms)
            let data = {
                users: this.selectedUsers.map(v => v[domainDetails['user_selector']]),
                values: filteredFields,
                permissions: filteredPerms
            }
            await new User({}).bulkUpdate(data)
            .then(response => {
                this.closeDialog();
                notificationBus.$emit('createNotification', 
                    {
                        message: (this.$tc("classes.user", this.selectedUsers.length) + " " + this.$t("words.saved.m")).toUpperCase(), 
                        type: 'success'
                    }
                );
                this.loading = false
                this.loadingColor = 'primary'
            })
            .catch(error => {
                console.error(error)
                this.loading = false
                this.loadingColor = 'error'
                this.error = true;
                this.errorMsg = this.getMessageForCode(error)
                notificationBus.$emit('createNotification',
                    {message: this.errorMsg.toUpperCase(), type: 'error'}
                )
            })
        },
        async closeDialog() {
            this.$emit('closeDialog', this.viewKey);
            this.$emit('refresh');
        },
	}
}
</script>
