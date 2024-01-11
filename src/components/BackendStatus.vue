<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: BackendStatus.vue ---------------------------->
<template>
<v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
        <v-btn @click="checkStatus" icon v-on="on" v-bind="attrs">
        <v-avatar :color="backendAlive == true ? 'green':'red'" size="1em"/>
        </v-btn>
    </template>
    <span>{{ $t('misc.clickToRefreshBackendStatus') }}</span>
</v-tooltip>
</template>

<script>
import Liveness from '@/include/Liveness.js'
export default {
    name: 'BackendStatus',
    props:{
        showText: Boolean
    },
    data() {
        return {
            backendAlive: false,
            checkInterval: 10000,
            timerId: 0
        }
    },
    async created(){
        await this.loopCheck()
    },
    methods: {
        async loopCheck(){
            if (this.backendAlive != true)
                this.checkInterval = 1000
            else
                this.checkInterval = 10000

            this.checkStatus()
            // Clear previous command timer.
            clearTimeout(this.timerId)
            this.timerId = setTimeout(() => {
                this.loopCheck()
            }, this.checkInterval)
        },
        async checkStatus() {
            await new Liveness({}).check()
            .then(() => {
                this.backendAlive = true
            })
            .catch(e => {
                console.error(e)
                this.backendAlive = false
            })
        }
    }
}
</script>

<style>
.be-status-indicator{
    --size: 0.8em;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: red;
}
</style>