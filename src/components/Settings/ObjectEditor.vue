<template>
<!-- Object Type Settings -->
<v-card flat outlined class="ma-0 px-6 py-2 pt-4">
    <v-row class="ma-0 pa-0 mb-2" justify="center">
        <span class="font-weight-normal">
            {{ label || $t("components.objectEditor") }}
        </span>
    </v-row>
    <v-row class="ma-0 pa-0 my-2" v-if="resettable" justify="center">
        <v-btn x-small outlined @click="emitReset">
            {{ $t("actions.reset") }}
        </v-btn>
    </v-row>
    <v-row class="ma-0 pa-0 px-4" v-show="!disableAddDelete">
        <v-text-field :label="$t('words.key')"
        class="pa-0 ma-0 ml-2 mr-4"
        :readonly="readonly"
        :hint="$t(keyHint)"
        :persistent-hint="persistentHint"
        @keydown.enter="addToObject(keyToAdd, valueToAdd)"
        v-model="keyToAdd"
        :required="required && keyToAdd.length == 0 ? true : false"
        :rules="isFieldInComplexValidators(keyToAdd) ? [fieldRules(valueToAdd, complexValidator.keyToAdd.k)] : valueValidator"
        />
        <v-text-field :label="$t('words.value')"
        class="pa-0 ma-0 mr-2"
        :readonly="readonly"
        :hint="$t(valueHint)"
        :persistent-hint="persistentHint"
        @keydown.enter="addToObject(keyToAdd, valueToAdd)"
        v-model="valueToAdd"
        :required="required && valueToAdd.length == 0 ? true : false"
        :rules="isFieldInComplexValidators(keyToAdd) ? [fieldRules(valueToAdd, complexValidator.keyToAdd.v)] : valueValidator"
        />
        <v-btn class="bg-primary text-white mt-2 ml-1" small
        :disabled="readonly == true || this.isFieldDisabled(keyToAdd) || keyToAdd in this.objectToEdit"
        @click="addToObject(keyToAdd, valueToAdd)"
        rounded
        icon>
            <v-icon>
                mdi-plus
            </v-icon>
        </v-btn>
    </v-row>
    <v-list-item v-bind="objectToEdit" v-for="subItem, subItemKey in objectToEdit" :key="subItemKey">
        <v-list-item-icon>
            <v-btn v-if="reorder" @click="moveItem(subItemKey)"
            x-small icon><v-icon>mdi-arrow-up</v-icon></v-btn>
            <v-btn v-if="reorder" @click="moveItem(subItemKey, false)"
            x-small icon><v-icon>mdi-arrow-down</v-icon></v-btn>
        </v-list-item-icon>
        <v-list-item-content class="ma-0 pa-0">
            <v-col class="ma-0 pa-0 px-2 py-1" cols="6">
                <v-text-field outlined
                    :dense="dense"
                    :disabled="isFieldDisabled(subItemKey)"
                    :hide-details="!complexValidator"
                    :hint="complexValidator ? complexValidator.subItemKey.kHint : undefined"
                    :required="required && subItemKey.length == 0 ? true : false"
                    :label="$t('words.key')"
                    :value="subItemKey"
                    readonly/>
            </v-col>
            <v-col class="ma-0 pa-0" cols="6">
                <v-text-field outlined
                    :dense="dense"
                    @change="updateValue(subItemKey, $event)"
                    :disabled="isFieldDisabled(subItemKey)"
                    :hide-details="!complexValidator"
                    :hint="complexValidator ? complexValidator.subItemKey.vHint : undefined"
                    :required="required && subItem.length == 0 ? true : false"
                    :label="$t('words.value')"
                    :value="subItem"
                    :readonly="readonly"/>
            </v-col>
        </v-list-item-content>
        <v-list-item-action class="ma-0 pa-0">
            <v-btn :class="'bg-primary text-white ml-2 ' + (complexValidator ? 'mb-7' : '')"
            :disabled="readonly == true || isFieldDisabled(subItemKey) || disableAddDelete && !isFieldDeletable(subItemKey)"
            v-show="!disableAddDelete || isFieldDeletable(subItemKey)"
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

// Complex Validator Object Structure:
// validators: {
// 'password':{
//      'k':'keyValidatorName',
//      'v':'valueValidatorName',
//      'kHint':'keyHint',
//      'vHint':'valueHint',
//  }
// }

export default {
    name: 'ObjectEditor',
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
        reorder: Boolean,
        label: String,
        dense: {
            type: Boolean,
            default: false
        },
        disableAddDelete: {
            type: Boolean,
            default: false
        },
        required: Boolean,
        readonly: Boolean,
        keyHint: String,
        valueHint: String,
        persistentHint: Boolean,
        keyValidator: Function,
        valueValidator: Function,
        disabledFields: {
            type: Array
        },
        deletableFields: {
            type: Array
        },
        resettable: Boolean,
        complexValidator: Object
    },
    emits: ['update:value'],
    created() {
        this.setObject()
    },
    watch: {
        value(new_v){
            this.objectToEdit = new_v
        },
    },
    methods: {
        forceUpdate(){
            this.$nextTick(()=>{
                this.$forceUpdate()
            })
        },
        setObject(){
            if (this.value != undefined)
                this.objectToEdit = this.value
            this.forceUpdate()
        },
        isFieldInComplexValidators(key){
            if (this.complexValidator != undefined)
                return key in this.complexValidator
        },
        isFieldDisabled(key){
            if (this.disabledFields != undefined)
                return this.disabledFields.includes(key)
        },
        isFieldDeletable(key){
            if (this.deletableFields != undefined)
                return this.deletableFields.includes(key)
        },
        updateValue(k, v){
            this.objectToEdit[k] = v
            this.updateObject()
        },
        addToObject(key, value){
            if (this.keyToAdd.length < 1 || this.valueToAdd.length < 1)
                return
            if (this.isFieldDisabled(key))
                return
            this.objectToEdit[key] = value
            this.valueToAdd = ""
            this.keyToAdd = ""
            this.updateObject()
        },
        removeFromObject(key){
            delete this.objectToEdit[key];
            this.updateObject()
        },
        emitReset(){
            this.$emit('reset')
        },
        updateObject(){
            this.$emit('update', this.objectToEdit)
            this.forceUpdate()
        },
        moveItem(k, up=true){
            var v = this.objectToEdit[k]
            var idx = Object.keys(this.objectToEdit).indexOf(k)
            // Convert Object to Key Value Array
            let keyValues = Object.entries(this.objectToEdit);
            // Remove item from Key Value pairs
            keyValues.splice(idx, 1);

            if (up){
                idx -= 1
                if (idx < 0)
                    idx = Object.keys(this.objectToEdit).length
            } else {
                idx += 1
                if (idx >= Object.keys(this.objectToEdit).length)
                    idx = 0
            }
            console.log(idx)
            // Re-add at new index
            keyValues.splice(idx, 0, [k, v]);
            this.objectToEdit = Object.fromEntries(keyValues)
            this.updateObject()
        },
    }
}
</script>
