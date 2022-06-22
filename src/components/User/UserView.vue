<template>
<v-card class="pa-6">
    <!-- Title Bar -->
    <v-card-title class="ma-0 pa-0">
        <v-row class="ma-0 pa-0" align="center" justify="space-between">
            <h3 v-if="!user.givenName || user.givenName == '' || !user.sn || user.sn == ''" class="pa-0 ma-0 ma-2">
                {{ user.username.toUpperCase() }}
            </h3>
            <h3 v-else class="pa-0 ma-0 ma-2">
                {{ user.givenName + " " + user.sn }}
            </h3>
            <v-divider class="mx-4"/>
            <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>
        </v-row>
    </v-card-title>

    <!-- Body -->
    <div>
        <v-col cols="4">
            {{ $t('section.users.attributes.givenName') + ": " + user.givenName }}
        </v-col>
        <v-col cols="4">
            {{ $t('section.users.attributes.sn') + ": " + user.sn }}
        </v-col>
    </div>

    <!-- Actions -->
    <v-card-actions class="">
        <v-row class="ma-1 pa-0" justify="end">
            <v-btn class="ma-0 pa-0 pa-4 mx-1" rounded :disabled="!editFlag">
                <v-icon class="mr-1">
                    mdi-content-save
                </v-icon>
                {{ $t("actions.save") }}
            </v-btn>
            <v-btn 
            class="mx-2 bg-primary" 
            color="white" 
            icon
            elevation="0"
            :loading="refreshLoading"
            @click="refreshUser"
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
    </v-card-actions>
</v-card>
</template>

<script>
export default {
    name: 'UserView',
    props: {
        viewKey: String,
        editFlag: Boolean,
        user: Object,
        refreshLoading: Boolean
    },
    created(){
        console.log(this.user)
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        refreshUser(){
            this.$emit('refreshUser');
        }
    },
    data () {
      return {
        categories: {
            basic: [
                "sAMAccountName",
                "givenName",
                "sn",
                "mail",
                "displayName",
                "is_enabled",
                "last_login",
                "telephoneNumber",
                "wWWHomePage",
            ],
            location: [
                "streetAddress",
                "postalCode",
                "l",
                "st",
                "countryCode",
                "co",
                "c",
            ],
            account: [
                "distinguishedName",
                "userPrincipalName",
                "userAccountControl",
                "whenCreated",
                "whenChanged",
                "lastLogon",
                "badPwdCount",
                "pwdLastSet",
                "primaryGroupID",
                "objectClass",
                "objectCategory",
                "sAMAccountType"
            ]
        }
      }
    }
}
</script>
