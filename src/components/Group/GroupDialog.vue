<template>    
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-expand-transition>
        <div v-show="!refreshLoading">
            <!-- Title Bar -->
            <v-card-title class="ma-0 pa-0 card-title">
                <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                    <h3 class="pa-0 ma-0 ma-2">
                    </h3>
                    <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                    <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-row>
            </v-card-title>
            
            <v-card-text class="ma-0 py-4">
                <v-form>
                <v-row align-content="center" class="mb-2">
                <v-col class="ma-0 pa-0" cols="12" md="6">
                    <v-text-field
                    dense
                    id="cn"
                    :label="$t('ldap.attributes.cn')"
                    :readonly="editFlag != true"
                    v-model="groupcopy.cn"
                    :rules="[this.fieldRules(groupcopy.cn, 'ge_name')]"
                    ></v-text-field>
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
        closeDialog() {
            this.$emit('closeDialog', this.viewKey);
        },
        // Sync the groupcopy object to the parent view group object on the
        // next tick to avoid mutation errors
        syncGroup(){
            this.groupcopy = new Group({})
            this.$nextTick(() => {
                this.groupcopy = this.group
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