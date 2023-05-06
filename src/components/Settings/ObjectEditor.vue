<template>
<!-- Object Type Settings -->
<v-card flat outlined class="ma-0 px-6 py-2 pt-4">
    <v-row class="ma-0 pa-0 mb-2" justify="center">
        <span class="font-weight-normal">
            {{ label || $t("components.objectEditor") }}
        </span>
    </v-row>
    <v-row class="ma-0 pa-0" v-show="allowAddDelete">
        <v-text-field :label="$t('words.key')"
        class="px-2"
        :readonly="readonly"
        :hint="$t(keyHint)"
        :persistent-hint="persistentHint"
        @keydown.enter="addToObject(keyToAdd, valueToAdd)"
        v-model="keyToAdd"
        :required="required && keyToAdd.length == 0 ? true : false"
        :rules="complexValidator ? [fieldRules(valueToAdd, complexValidator.keyToAdd.k)] : valueValidator"
        />
        <v-text-field :label="$t('words.value')"
        class="px-2"
        :readonly="readonly"
        :hint="$t(valueHint)"
        :persistent-hint="persistentHint"
        @keydown.enter="addToObject(keyToAdd, valueToAdd)"
        v-model="valueToAdd"
        :required="required && valueToAdd.length == 0 ? true : false"
        :rules="complexValidator ? [fieldRules(valueToAdd, complexValidator.keyToAdd.v)] : valueValidator"
        />
        <v-btn class="bg-primary text-white mt-3 ml-5"
        :disabled="readonly == true"
        @click="addToObject(keyToAdd, valueToAdd)"
        rounded
        icon>
            <v-icon>
                mdi-plus
            </v-icon>
        </v-btn>
    </v-row>
    <v-list-item v-bind="objectToEdit" v-for="subItem, subItemKey in objectToEdit" :key="subItemKey">
        <v-list-item-content class="ma-0 pa-0">
            <v-col class="ma-0 pa-0 px-2 py-1" cols="6">
                <v-text-field outlined
                    @change="updateSubItem(subItemKey, subItem)"
                    :dense="dense"
                    :hide-details="!complexValidator"
                    :hint="complexValidator ? complexValidator.subItemKey.kHint : undefined"
                    :required="required && subItemKey.length == 0 ? true : false"
                    :label="$t('words.key')"
                    :value="subItemKey" 
                    :readonly="keyReadonly || readonly"/>
            </v-col>
            <v-col class="ma-0 pa-0" cols="6">
                <v-text-field outlined
                    @change="updateSubItem(subItemKey, subItem)"
                    :dense="dense"
                    :hide-details="!complexValidator"
                    :hint="complexValidator ? complexValidator.subItemKey.vHint : undefined"
                    :required="required && subItem.length == 0 ? true : false"
                    :label="$t('words.value')"
                    :value="subItem" 
                    :readonly="readonly"/>
            </v-col>
        </v-list-item-content>
        <v-list-item-action class="ma-0 pa-0">
            <v-btn class="bg-primary text-white ml-2 mb-7"
            :disabled="readonly == true || !allowAddDelete"
            v-show="allowAddDelete"
            @click="removeFromObject(subItemKey)"
            rounded small
            icon>
                <v-icon small>
                    mdi-minus
                </v-icon>
            </v-btn>
        </v-list-item-action>
    </v-list-item>
</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';
import utilsMixin from '@/plugins/mixin/utilsMixin';

export default {
    mixins: [ validationMixin, utilsMixin ],
    data() {
        return {
            objectToEdit: {},
            keyToAdd: "",
            valueToAdd: ""
        }
    },
    props: {
        value: Object,
        label: String,
        dense: {
            type: Boolean,
            default: true
        },
        allowAddDelete: {
            type: Boolean,
            default: true
        },
        required: Boolean,
        readonly: Boolean,
        keyReadonly: Boolean,
        keyHint: String,
        valueHint: String,
        persistentHint: Boolean,
        keyValidator: Function,
        valueValidator: Function,
        complexValidator: Object
    },
    emits: ['update:value'],
    created() {
        this.setObject()
    },
    watch: {
        value(new_value){
            this.objectToEdit = new_value
        }
    },
    methods: {
        setObject(){
            if (this.value)
                this.objectToEdit = this.value
            this.$forceUpdate()
        },
        updateSubItem(key, value){
            if (this.keyToAdd.length < 1 || this.valueToAdd.length < 1)
                return
            this.objectToEdit[key] = value
            this.$emit('update', this.objectToEdit)
        },
        addToObject(key, value){
            if (this.keyToAdd.length < 1 || this.valueToAdd.length < 1)
                return
            this.objectToEdit[key] = value
            this.valueToAdd = ""
            this.keyToAdd = ""
            this.$emit('update', this.objectToEdit)
        },
        removeFromObject(key){
            delete this.objectToEdit[key];
            this.$emit('update', this.objectToEdit)
            // For some reason the v-bind isn't registering when removing an item
            this.$forceUpdate()
        }
    }
}
</script>
