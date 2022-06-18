<template>
<v-btn
    icon
    v-model="darkMode"
    @click="darkMode = !darkMode"
    class="ma-0 pa-0"
    :small="buttonIsSmall"
    >
    <v-icon id="toggler-input">mdi-contrast-circle</v-icon>
</v-btn>
</template>

<script>
export default {
    props:{
        buttonIsSmall: Boolean
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