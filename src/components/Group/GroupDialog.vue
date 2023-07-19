<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: GroupDialog.vue ----------------------------->
<template>    
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-expand-transition>
        <div v-show="!refreshLoading">
            <!-- Title Bar -->
            <v-card-title class="ma-0 pa-0 card-title">
                <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                    <h3 class="pa-0 ma-0 ma-2">
                        {{ $t('classes.group.single') + ': ' + groupcopy.cn }}
                    </h3>
                    <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                    <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-row>
            </v-card-title>
            
                
            <v-expand-transition>
                <v-row v-if="editFlag" justify="center" class="pa-0 ma-0">
                    <v-alert class="pa-0 ma-1 pa-4 pb-3 mt-3" border="top" type="warning" :icon="false">
                        <v-icon class="mdso mr-2">warning</v-icon>
                        {{ $t('section.groups.editFlagWarning') }}
                        <v-btn @click="viewGroup" small class="ma-0 pa-0 ml-2 pr-2 pl-1">
                            <v-icon color="orange" class="">mdi-chevron-left</v-icon>
                            {{ $t('actions.back') }}
                        </v-btn>
                    </v-alert>
                </v-row>
            </v-expand-transition>
            <!-- BODY -->
            <v-card-text class="ma-0 pa-0 py-4 pb-2">
                <v-form ref="groupForm" @submit.prevent>
                    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4">
                        <v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
                            <v-text-field
                            dense
                            id="cn"
                            :label="$t('ldap.attributes.cn')"
                            :readonly="editFlag != true && !loading"
                            v-model="groupcopy.cn"
                            :rules="[this.fieldRules(groupcopy.cn, 'ge_cn')]"
                            ></v-text-field>
                        </v-col>
                        <v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
                            <v-text-field
                            dense
                            id="mail"
                            :label="$t('ldap.attributes.mail')"
                            :readonly="editFlag != true"
                            v-model="groupcopy.mail"
                            :rules="[this.fieldRules(groupcopy.mail, 'ge_email')]"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4">
                        <v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
                            <v-text-field
                            dense
                            id="objectRid"
                            :label="$t('ldap.attributes.objectRid')"
                            readonly
                            v-model="groupcopy.objectRid"
                            ></v-text-field>
                        </v-col>
                        <v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
                            <v-text-field
                            dense
                            id="objectSid"
                            :label="$t('ldap.attributes.objectSid')"
                            readonly
                            v-model="groupcopy.objectSid"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row justify="center" class="ma-0 pa-0 mt-2">
                        <v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
                            <v-text-field
                            dense
                            id="distinguishedName"
                            :label="$t('ldap.attributes.distinguishedName')"
                            readonly
                            v-model="groupcopy.distinguishedName"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4 px-1">
                        <v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
                            <v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
                                <v-row class="ma-2">
                                    {{ $t('section.groups.groupDialog.groupType') }}
                                </v-row>
                                <v-radio-group
                                :readonly="!editFlag"
                                :disabled="!editFlag"
                                v-model="radioGroupType" class="ma-0 pa-0">
                                    <v-radio v-for="gt, key in groupTypes"
                                    :value="key"
                                    :key="key"
                                    :label="$t('section.groups.types.' + gt)"
                                    />
                                </v-radio-group>
                            </v-card>
                        </v-col>
                        <v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
                            <v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
                                <v-row class="ma-2">
                                    {{ $t('section.groups.groupDialog.groupScope') }}
                                </v-row>
                                <v-radio-group
                                :readonly="!editFlag"
                                :disabled="!editFlag"
                                v-model="radioGroupScope" class="ma-0 pa-0">
                                    <v-radio v-for="gs, key in groupScopes"
                                    :value="key"
                                    :key="key"
                                    :label="$t('section.groups.types.' + gs)"
                                    />
                                </v-radio-group>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- MEMBER BUTTONS -->
                    <v-row justify="center" class="ma-0 pa-0 my-4">
                        <v-col cols="8" class="ma-0 pa-0">
                            <v-btn @click="openDialog('addToGroup')"
                            rounded text color="primary" outlined :disabled="!editFlag" class="pa-3">
                                <v-icon small class="mr-1">mdi-plus</v-icon>
                                {{ $t("actions.addN") + " " + $t("words.member") }}
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                    </v-row>
                    <!-- MEMBER EXPANSION PANEL -->
                    <v-row v-if="showMemberTab" align-content="center" justify="center" class="ma-0 pa-0 my-4">
                        <v-col cols="10" md="8" class="ma-0 pa-0">
                            <v-expansion-panels v-model="memberPanelExpanded" flat 
                            :style="memberPanelExpanded == [0] ? 'border: 1px solid var(--clr-primary);' : 'border: 1px solid hsl(var(--clr-white-hue),var(--clr-white-sat),var(--clr-lig-80));'">
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        {{ $t('section.groups.groupDialog.members') }}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-list dense>
                                            <v-list-item v-for="member, key in this.groupcopy.member" :key="key"
                                            :class="key != 0 ? 'border-bottom': 'border-block'">
                                                <v-list-item-icon class="">
                                                    <v-icon v-if="isUserType(member.objectClass)">
                                                        mdi-account
                                                    </v-icon>
                                                    <v-icon v-else-if="member.objectClass.includes('group')">
                                                        mdi-google-circles-communities
                                                    </v-icon>
                                                    <v-icon v-else>
                                                        mdi-group
                                                    </v-icon>
                                                </v-list-item-icon>

                                                <v-list-item-content>
                                                    <v-row v-if="isUserType(member.objectClass)"
                                                    align="center" justify="center">
                                                        <v-col cols="12" class="pa-0 ma-0 px-1">
                                                            <span class="ma-0 pa-0">
                                                                {{ $t('classes.user.single') + ": " + ((member.givenName && member.sn) ? member.givenName + " " + member.sn + " (" + member.username + ")" : member.username) }}
                                                            </span>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-else-if="member.objectClass.includes('group')"
                                                    align="center" justify="center">
                                                        <v-col cols="12" class="pa-0 ma-0 px-1">
                                                            <span class="ma-0 pa-0">
                                                                {{ $t('classes.group.single') + ": " + member.cn }}
                                                            </span>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-else align="center" justify="center">
                                                        <v-col cols="12" class="pa-0 ma-0 px-1">
                                                            {{ member.distinguishedName }}
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-content>

                                                <v-list-item-action class="pa-0 ma-0">
                                                    <v-tooltip bottom color="primary">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn small icon
                                                        color="primary"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        <v-icon small>
                                                            mdi-help-circle
                                                        </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span> {{ member.distinguishedName }} </span>
                                                    </v-tooltip>
                                                </v-list-item-action>

                                                <v-list-item-action class="pa-0 ma-0">
                                                    <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn small icon @click="copyText(member.distinguishedName)"
                                                        color="primary"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        <v-icon small>
                                                            mdi-content-copy
                                                        </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span> {{ $t("section.groups.groupDialog.copyDistinguishedName") }} </span>
                                                    </v-tooltip>
                                                </v-list-item-action>

                                                <v-list-item-action class="pa-0 ma-0">
                                                    <v-tooltip bottom color="red">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn small icon @click="removeMember(member.distinguishedName, groupcopy.member)"
                                                        color="red"
                                                        :disabled="!editFlag"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        <v-icon small>
                                                            mdi-close
                                                        </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span> {{ $t("actions.remove") }} </span>
                                                    </v-tooltip>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </div>
        </v-expand-transition>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
                <!-- Edit Group Button -->
                <v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag != true" @click="editGroup">
                    <v-icon class="mr-1">
                        mdi-pencil
                    </v-icon>
                    {{ $t("actions.edit") }}
                </v-btn>
                <!-- View Group Button -->
                <v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag == true" @click="viewGroup">
                    <v-icon class="mr-1">
                        mdi-eye
                    </v-icon>
                    {{ $t("actions.view") }}
                </v-btn>
                <!-- Save Group Changes Button -->
                <v-btn @click="saveGroup"
                :class="(editFlag ? 'text-normal ' : '' ) + 'ma-0 pa-0 pa-4 ma-1 bg-white bg-lig-25'" 
                rounded 
                :disabled="!editFlag">
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
                </v-btn>
                <!-- Save Group Changes Button -->
                <v-btn @click="saveGroup(true)"
                :class="(editFlag ? 'text-normal ' : '' ) + 'ma-0 pa-0 pa-4 ma-1 bg-white bg-lig-25'" 
                rounded 
                :disabled="!editFlag">
                    <v-icon class="mr-1">
                        mdi-exit-to-app
                    </v-icon>
                    {{ $t("actions.saveClose") }}
                </v-btn>
                <!-- Refresh Group Button -->
                <v-progress-circular class="pa-0 ma-0" :color="loadingColor" value="100" :indeterminate="loading || fetchingData" size="38" width="7">
                    <v-btn small
                    class="ma-1 bg-primary" 
                    color="white" 
                    icon
                    :disabled="loading || fetchingData"
                    elevation="0"
                    :loading="refreshLoading"
                    @click="refreshGroup"
                    >
                        <v-icon>
                        mdi-refresh
                        </v-icon>
                        <template v-slot:loader>
                        <span class="custom-loader">
                            <v-icon color="white">mdi-cached</v-icon>
                        </span>
                        </template>
                    </v-btn>
                </v-progress-circular>
            </v-row>
        </v-card-actions>
        
        <!-- USER ADD TO GROUP DIALOG -->
        <v-dialog eager max-width="1200px" v-model="dialogs['addToGroup']">
            <CNObjectList
            :viewKey="'addToGroup'"
            ref="AddToGroup"
            @addDNs="addMembers"
            :excludeDNs="excludeDNs"
            @closeDialog="closeInnerDialog"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import Group from '@/include/Group';
import CNObjectList from '@/components/CNObjectList.vue'
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    components: {
        CNObjectList,
    },
    data() {
        return {
            userClasses: ['user','person','organizationalPerson','organizationalperson'],
            loading: false,
            loadingColor: 'accent',
            domain: "",
            realm: "",
            basedn: "",
            showMemberTab: false,
            groupcopy: {},
            excludeDNs: [],
            memberPanelExpanded: 0,
            membersToAdd: [],
            membersToRemove: [],
            groupTypes: [
                "GROUP_DISTRIBUTION",
                "GROUP_SECURITY"
            ],
            groupScopes: [
                "GROUP_GLOBAL",
                "GROUP_DOMAIN_LOCAL",
                "GROUP_UNIVERSAL"
            ],
            radioGroupType: 0,
            radioGroupScope: 0,
            // Dialog States
            dialogs: {
                addToGroup: false
            },
        }
    },
    mixins: [
        validationMixin
    ],
    created(){
        this.syncGroup();
    },
    watch: {
        'dialogs': {
            handler: function (newValue) {
                if (!newValue['addToGroup'] || newValue['addToGroup'] == false)
                this.$refs.AddToGroup.clearList();
            },
            deep: true
        }
    },
    props: {
        viewKey: String,
        editFlag: Boolean,
        group: Object,
        fetchingData: Boolean,
        refreshLoading: Boolean
    },
    methods: {
        copyText(textString) {
            navigator.clipboard.writeText(textString);
        },
        getMembersLength(){
            if (this.groupcopy.member != undefined) {
                if (this.groupcopy.member.length == 0 || !this.groupcopy.member)
                    this.showMemberTab = false
                else
                    this.showMemberTab = true
            }
        },
        setupExclude(){
            this.excludeDNs = []
            if (!this.excludeDNs.includes(this.groupcopy.distinguishedName))
                this.excludeDNs.push(this.groupcopy.distinguishedName)
            if (this.groupcopy.member != undefined && this.groupcopy.member.length > 0) {
                this.groupcopy.member.forEach(member => {
                    this.excludeDNs.push(member.distinguishedName)
                });
            }
            if (this.membersToAdd != undefined && this.membersToAdd.length > 0) {
                this.membersToAdd.forEach(member => {
                    if (!this.excludeDNs.includes(member))
                        this.excludeDNs.push(member)
                });
            }
            // this.logGroups()
        },
        openDialog(key){
            this.dialogs[key] = true;
            switch (key) {
                case 'addToGroup':
                    this.setupExclude()
                    this.$refs.AddToGroup.fetchLists(this.excludeDNs)
                break;
                default:
                break;
            }
        },
        closeDialog() {
            this.$emit('closeDialog', this.viewKey);
        },
        closeInnerDialog(key){
            this.dialogs[key] = false;
        },
        addMembers(members){
            this.membersToAdd = members.map(e => e.distinguishedName)
            if (!this.groupcopy.member)
                this.groupcopy.member = []
            members.forEach(g => {
                if (this.groupcopy.member.filter(e => e.distinguishedName == g.distinguishedName).length == 0)
                    this.groupcopy.member.push(g)

                if (this.membersToRemove != undefined) {
                    // console.log("MTR Includes this member, removing. " + g.distinguishedName)
                    this.membersToRemove = this.membersToRemove.filter(e => e != g.distinguishedName)
                }
            });
            this.closeInnerDialog('addToGroup')
            // this.logGroups()
            this.showMemberTab = true
            this.setupExclude()
            this.$forceUpdate
        },
        removeMember(memberDn) {
            if (!this.membersToRemove != undefined && !this.membersToRemove.includes(memberDn))
                this.membersToRemove.push(memberDn)

            if (this.membersToAdd != undefined && this.membersToAdd.includes(memberDn))
                this.membersToAdd = this.membersToAdd.filter(e => e != memberDn)

            if (this.excludeDNs != undefined && this.excludeDNs.includes(memberDn))
                this.excludeDNs = this.excludeDNs.filter(e => e != memberDn)

            this.groupcopy.member = this.groupcopy.member.filter(e => e.distinguishedName != memberDn)
            // this.logGroups()
            if (this.groupcopy.member == undefined || this.groupcopy.member.length == 0)
                this.showMemberTab = false
            this.setupExclude()
            this.$forceUpdate
        },
        logGroups(){
            console.log("Member Array")
            console.log(this.groupcopy.member)
            console.log("Members to Add")
            console.log(this.membersToAdd)
            console.log("Members to Remove")
            console.log(this.membersToRemove)
            console.log("Exclude DNs")
            console.log(this.excludeDNs)
        },
        checkIfGroupBuiltIn(){
            if (this.group.groupType.includes('GROUP_SYSTEM'))
                return true
            return false
        },
        addToArray(value, object, itemRef=undefined){
            var array = object.value
            if (itemRef){
                if (this.$refs[itemRef][0].validate()) {
                    if (!array.includes(value) && array && value)
                        array = array.push(value);
                }
            } 
            else if (!array.includes(value) && array && value){
                array = array.push(value);
            }
            return array
        },
        setGroupTypeAndScope(){
            if (this.group.groupType != undefined) {
                this.group.groupType.forEach(groupSetting => {
                    switch (groupSetting) {
                        case 'GROUP_DISTRIBUTION':
                            this.radioGroupType = 0;
                            break;
                        case 'GROUP_SECURITY':
                            this.radioGroupType = 1;
                            break;
                        case 'GROUP_GLOBAL':
                            this.radioGroupScope = 0;
                            break;
                        case 'GROUP_DOMAIN_LOCAL':
                            this.radioGroupScope = 1;
                            break;
                        case 'GROUP_UNIVERSAL':
                            this.radioGroupScope = 2;
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        // Sync the groupcopy object to the parent view group object on the
        // next tick to avoid mutation errors
        syncGroup(){
            this.groupcopy = new Group({})
            this.membersToRemove = []
            this.membersToAdd = []
            this.excludeDNs = []
            this.showMemberTab = false
            this.$nextTick(() => {
                this.groupcopy = this.group
                this.setGroupTypeAndScope()
                this.getMembersLength()
                this.setupExclude()
                this.loading = false
                this.loadingColor = 'primary'
            })
        },
        isUserType(itemObjectClasses){
            var isUser = false
            itemObjectClasses.forEach(v => {
                if (this.userClasses.includes(v))
                    isUser = true
            })
            return isUser
        },
        // Tells the parent view to refresh/fetch the group again
        async refreshGroup(){
            this.loading = true
            this.$emit('refreshGroup', this.group);
            this.setupExclude()
            this.loading = false
            this.loadingColor = 'primary'
        },
        async saveGroup(closeDialog=false){
            this.loading = true
            this.loadingColor = 'primary'
            this.groupcopy.groupType = this.radioGroupType
            this.groupcopy.groupScope = this.radioGroupScope
            // Set members
            // Members to Add
            if (this.membersToAdd.length > 0)
                this.groupcopy.membersToAdd = this.membersToAdd
            else
                delete this.groupcopy.membersToAdd
            // Members to Remove
            if (this.membersToRemove.length > 0)
                this.groupcopy.membersToRemove = this.membersToRemove
            else
                delete this.groupcopy.membersToRemove

            if (this.$refs.groupForm.validate()){
                await new Group({}).update({group: this.groupcopy})
                .then(() => {
                    if (closeDialog == true)
                        this.closeDialog();
                    else
                        this.refreshGroup();
                    this.$emit('save', this.viewKey, this.groupcopy);
                    this.loading = false
                    this.loadingColor = 'primary'
                })
                .catch(error => {
                    console.error(error)
                    if (error.response.data.code) {
                        switch (error.response.data.code) {
                            default:
                                this.errorMsg = this.$t("error.unknown_short")
                                break;
                        }
                    } else {
                        this.errorMsg = this.$t("error.unknown_short")
                    }
                    this.loading = false
                    this.loadingColor = 'error'
                    this.error = true;
                })
            } else {
                this.loading = false
                this.loadingColor = 'error'
                this.error = true;
            }
        },
        editGroup(){
            this.$emit('editToggle', true);
        },
        viewGroup(){
            this.$emit('editToggle', false);
            this.refreshGroup();
        },
    },
}
</script>

<style>
.border-top {
    border-top: 1px solid rgba(0,0,0,0.1);
}
.border-bottom {
    border-bottom: 1px solid rgba(0,0,0,0.1);
}
.border-block {
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.1);
}

[theme=dark] .border-top,
[theme=dark] .border-bottom,
[theme=dark] .border-block {
    border-color: rgba(255,255,255,0.1)
}
</style>