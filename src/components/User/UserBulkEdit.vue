<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserBulkEdit.vue ------------------------------>
<template>
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.users.bulkEdit.title') }}
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
                        disable-add-delete
                        resettable
                        :value="fields"
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
	</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import ObjectEditor from '../Settings/ObjectEditor.vue';
import UserPermissionList from './UserPermissionList.vue';

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
        viewKey: String,
		refreshLoading: Boolean
	},
	data() {
		return {
            fields: {},
            permissions: {}
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
                "givenName":"",
                "sn":"",
                "displayName":"",
                "mail":"",
                "telephoneNumber":"",
                "streetAddress":"",
                "postalCode":"",
                "l":"",
                "st":"",
                "countryCode":"",
                "co":"",
                "c":"",
                "wWWHomePage":"",
            }
        },
        setDefaultFields(){
            this.fields = this.getDefaultFields()
        },
        async closeDialog(editConfirm=false) {
            if (editConfirm == true) {
				await new User({}).bulkEdit(this.userObjectList)
				.then(() => {})
				.catch(error => { console.error(error) })
                this.$emit('closeDialog', this.viewKey, true);
            } else
                this.$emit('closeDialog', this.viewKey);
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
