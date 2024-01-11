<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: ThemeChanger.vue ---------------------------->
<template>
<v-btn v-if="!buttonIsSwitch"
    icon
    v-model="darkMode"
    :dark="dark"
    :light="light"
    @click="darkMode = !darkMode"
    class="ma-0 pa-0"
    :small="buttonIsSmall"
    >
    <v-icon id="toggler-input">mdi-contrast-circle</v-icon>
</v-btn>
<v-switch v-else
    v-model="darkMode"
    :dark="dark"
    :light="light"
    class="ma-0 pa-0"
    hide-details
    :label="$t('misc.darkMode')"
></v-switch>
</template>

<script>
export default {
    name: 'ThemeChanger',
    props:{
        dark: Boolean,
        light: Boolean,
        buttonIsSmall: Boolean,
        buttonIsSwitch: Boolean
    },
    data() {
        return {
            darkMode: false
        }
    },
    mounted: function () {
        // check for active theme
        let htmlElement = document.documentElement;
        let theme = localStorage.getItem("theme");

        if (theme === 'dark') {
            htmlElement.setAttribute('theme', 'dark')
            this.darkMode = true
        } else {
            htmlElement.setAttribute('theme', 'light');
            this.darkMode = false
        }
    },
    watch: {
        darkMode: function () {
            // add/remove class to/from html tag
            let htmlElement = document.documentElement;

            if (this.darkMode) {
                localStorage.setItem("theme", 'dark');
                htmlElement.setAttribute('theme', 'dark');
                this.$emit('darkMode', true);
                this.$vuetify.theme.dark = true;
            } else {
                localStorage.setItem("theme", 'light');
                htmlElement.setAttribute('theme', 'light');
                this.$emit('darkMode', false);
                this.$vuetify.theme.dark = false;
            }
        }
    }
}
</script>

<style>
</style>