<template>
    <v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4 px-1">
        <v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
            <v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
                <v-row class="ma-2">
                    {{ $t('section.groups.groupDialog.groupType') }}
                </v-row>
                <v-radio-group @change="emitValueUpdate('radioGroupScope', selectedRadioGroupType)"
                mandatory
                :readonly="!editFlag"
                :disabled="!editFlag"
                v-model="selectedRadioGroupType" class="ma-0 pa-0">
                    <v-radio v-for="gt, key in groupTypes"
                    :value="key"
                    :key="key"
                    :label="$t('section.groups.types.' + gt)"
                    />
                </v-radio-group>
            </v-card>
        </v-col>
        <v-col class="ma-0 pa-0 mx-2 mb-2" cols="12" md="4">
            <v-card outlined height="100%" class="ma-1 pa-0 px-3 py-1">
                <v-row class="ma-2">
                    {{ $t('section.groups.groupDialog.groupScope') }}
                </v-row>
                <v-radio-group @change="emitValueUpdate('radioGroupScope', selectedRadioGroupScope)"
                mandatory
                :readonly="!editFlag"
                :disabled="!editFlag"
                v-model="selectedRadioGroupScope" class="ma-0 pa-0">
                    <v-radio v-for="gs, key in groupScopes"
                    :value="key"
                    :key="key"
                    :label="$t('section.groups.types.' + gs)"
                    />
                </v-radio-group>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        editFlag: Boolean,
        radioGroupType: Number,
        radioGroupScope: Number
    },
    mounted () {
        this.selectedRadioGroupType = this.radioGroupType;
        this.selectedRadioGroupScope = this.radioGroupScope;
    },
    data() {
        return {
            selectedRadioGroupType: 0,
            selectedRadioGroupScope: 0,
            groupTypes: [
                "GROUP_DISTRIBUTION",
                "GROUP_SECURITY"
            ],
            groupScopes: [
                "GROUP_GLOBAL",
                "GROUP_DOMAIN_LOCAL",
                "GROUP_UNIVERSAL"
            ],
        }
    },
    methods: {
        reloadRadioValues(){
            this.selectedRadioGroupType = this.radioGroupType;
            this.selectedRadioGroupScope = this.radioGroupScope;
        },
        emitValueUpdate(key, value) {
            this.$emit('update', key, value)
        }
    },
}
</script>