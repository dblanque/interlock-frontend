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
            
            <v-card-text class="ma-0 py-4 pb-2">
                <v-form>
                    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4">
                        <v-col class="ma-0 pa-0 mx-2" cols="12" md="5">
                            <v-text-field
                            dense
                            id="cn"
                            :label="$t('ldap.attributes.cn')"
                            :readonly="editFlag != true && !loading"
                            v-model="groupcopy.cn"
                            :rules="[this.fieldRules(groupcopy.cn, 'ge_name')]"
                            ></v-text-field>
                        </v-col>
                        <v-col class="ma-0 pa-0 mx-2" cols="12" md="5">
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

                    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4 px-1">
                        <v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
                            <v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
                                <v-row class="ma-2">
                                    {{ $t('section.groups.groupDialog.groupType') }}
                                </v-row>
                                <v-radio-group v-model="radioGroupType" class="ma-0 pa-0">
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
                                <v-radio-group v-model="radioGroupScope" class="ma-0 pa-0">
                                    <v-radio v-for="gs, key in groupScopes" 
                                    :value="key"
                                    :key="key"
                                    :label="$t('section.groups.types.' + gs)"
                                    />
                                </v-radio-group>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row align-content="center" justify="center" class="ma-0 pa-0 my-4">
                        <v-col cols="8" class="ma-0 pa-0">
                            <v-expansion-panels flat style="border: 1px solid var(--clr-primary);">
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        {{ $t('section.groups.groupDialog.members') }}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <!-- TODO - Add tooltip that shows Full DN for object -->
                                        <!-- TODO - Add "Remove Member" action -->
                                        <!-- TODO - Add "Add Member" action -->
                                        <v-list dense v-if="getMembersLength">
                                            <v-list-item v-for="member, key in this.groupcopy.member" :key="key">
                                                <v-row v-if="member.objectCategory == 'user' || member.objectCategory == 'person' || member.objectCategory == 'organizationalPerson'">
                                                    <v-col cols="12" class="pa-0 ma-0">
                                                        {{ $t('classes.user.single') + ": " + ((member.givenName != "" && member.sn != "") ? member.givenName + " " + member.sn + " (" + member.username + ")" : member.username) }}
                                                    </v-col>
                                                </v-row>
                                                <v-row v-else-if="member.objectCategory == 'group'">
                                                    <v-col cols="12" class="pa-0 ma-0">
                                                        {{ $t('classes.group.single') + ": " + member.cn }}
                                                    </v-col>
                                                </v-row>
                                                <v-row v-else>
                                                    <v-col cols="12" class="pa-0 ma-0">
                                                        {{ member.dn }}
                                                    </v-col>
                                                </v-row>
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
                <v-progress-circular class="pa-0 ma-0" :color="loadingColor" value="100" :indeterminate="loading" size="38" width="7">
                    <v-btn small
                    class="ma-1 bg-primary" 
                    color="white" 
                    icon
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
    </v-card>
</template>

<script>
import Group from '@/include/Group';
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    data() {
        return {
            loading: false,
            loadingColor: 'accent',
            domain: "",
            realm: "",
            basedn: "",
            groupcopy: {},
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
        }
    },
    mixins: [
        validationMixin
    ],
    created(){
        this.syncGroup();
    },
    props: {
        viewKey: String,
        editFlag: Boolean,
        group: Object,
        refreshLoading: Boolean
    },
    methods: {
        getMembersLength(){
            if (this.groupcopy != undefined)
                if (this.groupcopy.member.length != 0)
                    return true
            return false
        },
        closeDialog() {
            this.$emit('closeDialog', this.viewKey);
        },
        checkIfGroupBuiltIn(){
            if (this.group.groupType.includes('GROUP_SYSTEM'))
                return true
            return false
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
            this.$nextTick(() => {
                this.groupcopy = this.group
                this.setGroupTypeAndScope()
                this.loading = false
                this.loadingColor = 'primary'
            })
        },
        // Tells the parent view to refresh/fetch the group again
        async refreshGroup(){
            this.loading = true
            this.$emit('refreshGroup', this.group);
            this.loading = false
            this.loadingColor = 'primary'
        },
        saveGroup(){
            console.log('save')
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