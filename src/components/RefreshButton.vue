<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: RefreshButton.vue --------------------------->
<template>
<div>
    <!-- Refresh User Button -->
    <v-progress-circular :class="`ma-0 pa-0 ${contentClass} ${componentClass}`" :color="loadingColor || buttonColor" :value="loadingValue" :indeterminate="loading || fetchingData" 
        :size="dense ? 36 : 38" :width="!dense ? 7 : 4">
        <v-btn :small="small && !dense" :x-small="dense"
        :class="buttonClass" 
        :color="buttonColor"
        :icon="buttonIcon"
        :fab="!buttonIcon"
        :disabled="loading || fetchingData"
        elevation="0"
        :loading="loading"
        @click="emitRefresh"
        >
            <v-icon :color="iconColor" :size="dense ? 24 : undefined">
            mdi-refresh
            </v-icon>        
            <template v-slot:loader>
            <span class="custom-loader">
                <v-icon :color="iconColor" :size="dense ? 24 : undefined">mdi-cached</v-icon>
            </span>
            </template>
        </v-btn>
    </v-progress-circular>
</div>
</template>
<script>
export default {
    name: 'RefreshButton',
    props: {
        loadingColor: {
            type: String,
            default: undefined
        },
        iconColor:{
            type: String,
            default: 'white'
        },
        buttonColor:{
            type: String,
            default: 'primary'
        },
        buttonClass: {
            type: String,
            default: ''
        },
        buttonIcon: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: true
        },
        dense: {
            type: Boolean,
            default: false
        },
        componentClass: {
            type: String,
            default: ''
        },
        contentClass: {
            type: String,
            default: ''
        },
        loading: Boolean,
        fetchingData: {
            type: Boolean,
            default: false
        },
        loadingValue: {
            type: Number,
            default: 100
        }
    },
    methods: {
        emitRefresh() {
            this.$emit('refresh')
        }
    },
}
</script>