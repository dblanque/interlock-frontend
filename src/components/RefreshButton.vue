<template>
<div>
    <!-- Refresh User Button -->
    <v-progress-circular :class="'pa-0 ma-0 ' + componentClasses" :color="loadingColor" :value="loadingValue" :indeterminate="loading || fetchingData" size="38" width="7">
        <v-btn small
        :class="buttonClasses" 
        :color="iconColor"
        icon
        :disabled="loading || fetchingData"
        elevation="0"
        :loading="loading"
        @click="emitRefresh"
        >
            <v-icon>
            mdi-refresh
            </v-icon>        
            <template v-slot:loader>
            <span class="custom-loader">
                <v-icon :color="iconColor">mdi-cached</v-icon>
            </span>
            </template>
        </v-btn>
    </v-progress-circular>
</div>
</template>
<script>
export default {
    props: {
        loadingColor: {
            type: String,
            default: 'primary'
        },
        iconColor:{
            type: String,
            default: 'white'
        },
        buttonClasses: {
            type: String,
            default: 'bg-primary'
        },
        componentClasses: {
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