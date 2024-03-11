<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserBulkUpdate.vue ------------------------------>
<template>
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.users.bulkUpdate.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>
        <v-row justify="center" class="ma-0 pa-0 pa-4">
            <v-col cols="12" md="6" :class="'pa-0 ma-0' + colMarginsR">
                <v-card height="100%" flat outlined>
                    <ObjectEditor allow-empty-fields
                        dense
                        resettable
                        :value="fields"
                        :value-choices="choicesFields"
                        :key-choices="getKeyChoiceFields()"
                        @reset="setDefaultFields()"
                    />
                </v-card>
            </v-col>
            <v-col cols="12" md="6" :class="'pa-0 ma-0' + colMarginsL">
                <UserPermissionList
                    emit-default
                    @default="getPermissionsFromComponent"
                    @update="onClickPermission"
                    edit-flag
                    content-class="ma-0 pa-0"
                    hide-sidebar/>
            </v-col>
        </v-row>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" 
                align="center" 
                align-content="center" 
                :justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'space-between'">
                <v-row align="center"
                    :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
                    class="ma-0 pa-0">
                <!-- Save Users Changes Button -->
                <v-btn @click="saveUsers" 
                :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-4 ma-1"
                rounded>
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
                </v-btn>
                <!-- Save & Close Users Changes Button -->
                <v-btn @click="saveUsers(true)" 
                :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import ObjectEditor from '../Settings/ObjectEditor.vue';
import UserPermissionList from './UserPermissionList.vue';
import User from '@/include/User.js';
import { getDomainDetails } from '@/include/utils.js';

export default {
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
		refreshLoading: Boolean
	},
	data() {
		return {
            fields: {},
            permissions: {},
            choicesFields: {}
		}
	},
    created(){
        this.setDefaultFields()
    },
	methods: {
        resetComponent(){
            this.setDefaultFields()
        },
        getDefaultFields(){
            return {
                "givenName":{
                    text_i18n: "ldap.attributes.givenName",
                    value: ""
                },
                "sn":{
                    text_i18n: "ldap.attributes.sn",
                    value: ""
                },
                "displayName":{
                    text_i18n: "ldap.attributes.displayName",
                    value: ""
                },
                "telephoneNumber":{
                    text_i18n: "ldap.attributes.telephoneNumber",
                    value: ""
                },
                "streetAddress":{
                    text_i18n: "ldap.attributes.streetAddress",
                    value: ""
                },
                "postalCode":{
                    text_i18n: "ldap.attributes.postalCode",
                    value: ""
                },
                "l":{
                    text_i18n: "ldap.attributes.l",
                    value: ""
                },
                "st":{
                    text_i18n: "ldap.attributes.st",
                    value: ""
                },
                "co":{
                    text_i18n: "ldap.attributes.co",
                    value: ""
                },
                "wWWHomePage":{
                    text_i18n: "ldap.attributes.wWWHomePage",
                    value: ""
                },
            }
        },
        setDefaultFields(){
            this.fields = {}
            this.choicesFields = {
                "co": {
                    values: this.getCountryList(),
                    type: "autocomplete"
                }
            }
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
        async saveUsers(closeDialog=false){
            let domainDetails = getDomainDetails()
            Object.filter = (obj, predicate) => 
                Object.keys(obj)
                    .filter( key => predicate(obj[key]) )
                    .reduce( (res, key) => (res[key] = obj[key], res), {} );
            let filteredFields = Object.filter(this.fields, v => v.length > 0)
            let filteredPerms = Object.filter(this.permissions, v => v.value === true)
            filteredPerms = Object.keys(filteredPerms)
            console.log(this.selectedUsers.map(v => v[domainDetails['user_selector']]))
            console.log(filteredFields)
            console.log(filteredPerms)
            let data = {
                users: this.selectedUsers,
                values: filteredFields,
                permissions: filteredPerms
            }
            await new User({}).bulkUpdate(data)
            .then(response => {
                console.log(response)
            })
            .catch(error => { console.error(error) })
        },
        async closeDialog() {
            this.$emit('closeDialog', this.viewKey, true);
        },
        getPermissionsFromComponent(permissions){
            this.permissions = permissions
        },
        // When a permission in the v-list changes this function is executed
        onClickPermission(key){
            this.permissions[key].value = !this.permissions[key].value
        },
	}
}
</script>
