<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: AboutDialog.vue ----------------------------->
<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2 ml-3">
                    {{ $t('contrib.title') }}
                </h3>
                <v-btn
                icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>
        <v-card-text class="mt-4 pa-2 pt-0 font-weight-medium">
            <!-- Main MSG -->
            <v-row class="my-2 mx-1">
                <span v-html="$t('contrib.mainMsg')"/>
            </v-row>
            <h3 class="mt-3 mb-1">
                {{ $t('contrib.subTitle') }}
            </h3>
            <v-row class="my-2 mx-1" justify="start">
                <ul class="contrib-list">
                    <li>
                        Javier Blanqué - 
                        <a href="https://javier.blanque.com.ar" target="_blank">(https://javier.blanque.com.ar)</a>
                        <ul>
                            <li v-html="$t('contrib.jblanque')"/>
                        </ul>
                    </li>
                    <li>
                        Martín Vilche - 
                        <a href="https://martinvsolutions.com" target="_blank">(https://martinvsolutions.com)</a>
                        <ul>
                            <li v-for="v, k in $t('contrib.mvilche')" :key="k">
                                <span v-html="$t('contrib.mvilche.' + k)"/>
                            </li>
                        </ul>
                    </li>
                    <li>
                        Etianen - 
                        <a href="https://github.com/etianen/django-python3-ldap" target="_blank">(https://github.com/etianen/django-python3-ldap)</a>
                        <ul>
                            <li v-html="$t('contrib.etianen')"/>
                        </ul>
                    </li>
                    <li>
                        Dirk Jan M. - 
                        <a href="https://github.com/dirkjanm/krbrelayx" target="_blank">(https://github.com/dirkjanm/krbrelayx)</a>
                        <ul>
                            <li v-html="$t('contrib.dirkjanm')"/>
                        </ul>
                    </li>
                </ul>
            </v-row>

            <v-row class="ma-0 pa-0" justify="center">
                {{ $t('misc.version') + ": " + version }}
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import local_config from "../../public/config/local.json";

export default {
    data(){
        return {
            version: local_config.version
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close')
        }
    },
}
</script>

<style>
.contrib-list li{
    text-align: left;
}
</style>