<template>
<v-card class="pa-6">
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
    <v-card-text>
    </v-card-text>
    <v-card-actions class="">
        <v-row class="ma-1 pa-0" justify="center">
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
        user: Object
    },
    created(){
        console.log(this.user)
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        }
    },
    data () {
      return {
      }
    }
}
</script>
