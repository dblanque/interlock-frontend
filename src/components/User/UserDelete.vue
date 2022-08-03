<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.users.deleteUser.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-card-text class="pa-0 ma-0">
            <v-row class="pa-0 ma-8 text-subtitle-1 text-inverted" justify="center">
                {{ $t('section.users.deleteUser.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ userObject.givenName && userObject.sn ? userObject.givenName + " " + userObject.sn + " (" + userObject.username + ")" : userObject.username }}
                </span>
                ?
            </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @click="closeDialog(true)"
                class="ma-0 pa-0 pa-2 ma-1 bg-white bg-lig-25" 
                rounded>
                    <v-icon class="mr-1" color="green">
                        mdi-checkbox-marked-circle-outline
                    </v-icon>
                    <span class="pr-1 text-normal">
                        {{ $t("actions.yes" )}}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog"
                class="ma-0 pa-0 pa-2 ma-1 bg-white bg-lig-25" 
                rounded>
                    <span class="pl-1 text-normal">
                        {{ $t("actions.no" )}}
                    </span>
                    <v-icon class="ml-1" color="red">
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import User from '@/include/User'

export default {
    name: "confirmDialog",
    props: {
        userObject: Object,
        viewKey: String
    },
    created() {
    },
    methods: {
        async closeDialog(deleteConfirm=false, user={}) {
            if (user != {}) {
                user.distinguishedName = this.userObject.distinguishedName
                user.username = this.userObject.username
            }
            if (deleteConfirm == true) {
                await new User({}).delete(user)
                .then(response => {
                    if (response.data.username == user.username)
                        console.log("User Deleted Successfully")
                    this.$emit('refresh');
                })
                .catch(error => {
                    console.log(error)
                })
            }
            this.$emit('closeDialog', this.viewKey);
        },
    }
}
</script>

<style>
.outlined {
    border: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

.card-title {
    border-radius: 4px;
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-100));
    position: sticky !important;
    top: 0 !important;
    z-index: 100;
    border-bottom: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

[theme=dark] .card-title {
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-85));
}

.card-actions {
    border-radius: 4px;
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-100));
    position: sticky !important;
    bottom: 0 !important;
    z-index: 100;
    border-top: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

[theme=dark] .card-actions {
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-85));
}
</style>