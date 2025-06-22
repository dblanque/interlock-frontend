<template>
    <!-- Object Type Settings -->
    <div :class="contentClass">
        <v-row v-if="showTitle" class="ma-0 pa-0 mb-2" justify="center">
            <span class="font-weight-normal">
                {{ label || $t("components.objectEditor") }}
            </span>
        </v-row>
        <v-row class="ma-0 pa-0 mt-2 mb-6" v-if="resettable" justify="center">
            <v-btn x-small outlined @click="emitReset">
                {{ $t("actions.reset") }}
            </v-btn>
        </v-row>
        <v-row align="center" justify="center" class="ma-0 pa-0" v-show="!disableAddDelete">
            <v-col class="ma-0 pa-0" cols="5">
                <v-text-field v-if="keyChoices.length == 0"
                    :dense="dense"
                    :label="$t('words.key')"
                    class="pa-0 ma-0 ml-2 mr-4"
                    :readonly="readonly"
                    :hint="$t(keyHint)"
                    :persistent-hint="persistentHint"
                    @keydown.enter="addToObject(keyToAdd, valueToAdd)"
                    v-model="keyToAdd"
                    outlined
                    :required="required && keyToAdd.length == 0 ? true : false"
                    :rules="isFieldInComplexValidators(keyToAdd) ? [fieldRules(valueToAdd, complexValidator.keyToAdd.k)] : valueValidator" />
                <v-select v-else
                    :dense="dense"
                    :items="keyChoices"
                    :label="$t('words.key')"
                    :readonly="readonly"
                    class="pa-0 ma-0 ml-2 mr-4"
                    outlined
                    v-model="keyToAdd">
                    <template slot="selection" slot-scope="data">
                        <!-- HTML that describe how select should render selected items -->
                        <span>
                            {{ getSelectText(data.item) }}
                        </span>
                    </template>
                    <template
                        slot="item"
                        slot-scope="data">
                        <!-- HTML that describe how select should render items when the select is open -->
                        <span>
                            {{ getSelectText(data.item) }}
                        </span>
                    </template>
                </v-select>
            </v-col>
            <v-col
                class="ma-0 pa-0"
                cols="5">
                <v-text-field
                    :label="$t('words.value')"
                    v-if="!isChoicesField(keyToAdd)"
                    :dense="dense"
                    :hint="$t(valueHint)"
                    :persistent-hint="persistentHint"
                    :readonly="readonly"
                    :required="required && valueToAdd.length == 0 ? true : false"
                    :rules="isFieldInComplexValidators(keyToAdd) ? [fieldRules(valueToAdd, complexValidator.keyToAdd.v)] : valueValidator"
                    @keydown.enter="addToObject(keyToAdd, valueToAdd)"
                    class="pa-0 ma-0 mr-2"
                    outlined
                    v-model="valueToAdd" />
                <v-select
                    v-else-if="valueChoices[keyToAdd].type == 'select'"
                    :append-icon="getSelectIcon(keyToAdd, 'append')"
                    :dense="dense"
                    :hint="$t(valueHint)"
                    :items="valueChoices[keyToAdd].values"
                    :label="getSelectLabel(keyToAdd)"
                    :persistent-hint="persistentHint"
                    :prepend-icon="getSelectIcon(keyToAdd, 'prepend')"
                    :readonly="readonly"
                    :value="valueToAdd"
                    @change="updateValue(keyToAdd, $event)"
                    outlined>
                    <template
                        slot="selection"
                        slot-scope="data">
                        <!-- HTML that describe how select should render selected items -->

                        <span>
                            {{ getSelectText(data.item) }}
                        </span>
                        <!-- <span v-else>
                            {{ data.value.toUpperCase() }}
                        </span> -->
                    </template>
                    <template
                        slot="item"
                        slot-scope="data">
                        <!-- HTML that describe how select should render items when the select is open -->
                        <span>
                            {{ getSelectText(data.item) }}
                        </span>
                        <!-- <span v-else>
                            {{ data.value.toUpperCase() }}
                        </span> -->
                    </template>
                </v-select>
                <v-autocomplete
                    v-else
                    :dense="dense"
                    :hint="$t(valueHint)"
                    :items="LDAPCountries"
                    :label="getSelectLabel(keyToAdd)"
                    :persistent-hint="persistentHint"
                    :readonly="readonly"
                    :rules="[v => { return valueChoices[keyToAdd].values.includes(v) || valueToAdd != undefined && valueToAdd.length == 0 }]"
                    :value="valueToAdd"
                    @change="updateValue(keyToAdd, $event)"
                    outlined>
                </v-autocomplete>
            </v-col>
            <v-col
                :class="`${actionButtonClasses} mb-6`"
                cols="auto">
                <v-btn
                    small
                    color="primary"
                    :disabled="readonly == true || this.isFieldDisabled(keyToAdd) || keyToAdd in this.objectToEdit"
                    @click="addToObject(keyToAdd, valueToAdd)"
                    rounded
                    icon>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <!-- VALUES -->
        <v-list-item
            v-bind="objectToEdit"
            v-for="subItem, subItemKey in objectToEdit"
            :key="subItemKey">
            <v-list-item-icon v-if="reorder">
                <v-btn
                    @click="moveItem(subItemKey)"
                    x-small
                    icon><v-icon>mdi-arrow-up</v-icon></v-btn>
                <v-btn
                    @click="moveItem(subItemKey, false)"
                    x-small
                    icon><v-icon>mdi-arrow-down</v-icon></v-btn>
            </v-list-item-icon>
            <v-list-item-content class="ma-0 pa-0">
                <v-col
                    class="ma-0 pa-0 px-2 py-1"
                    cols="6">
                    <v-text-field
                        outlined
                        :dense="dense"
                        :disabled="isFieldDisabled(subItemKey)"
                        :hide-details="!complexValidator"
                        :hint="complexValidator ? complexValidator.subItemKey.kHint : undefined"
                        :required="required && subItemKey.length == 0 ? true : false"
                        :label="$t('words.key')"
                        :value="subItemKey"
                        readonly />
                </v-col>
                <v-col
                    class="ma-0 pa-0"
                    cols="6">
                    <v-text-field
                        outlined
                        v-if="!isChoicesField(subItemKey)"
                        :dense="dense"
                        @change="updateValue(subItemKey, $event)"
                        :disabled="isFieldDisabled(subItemKey)"
                        :hide-details="!complexValidator"
                        :hint="complexValidator ? complexValidator.subItemKey.vHint : undefined"
                        :required="required && subItem.length == 0 ? true : false"
                        :label="$t('words.value')"
                        :value="subItem"
                        :readonly="readonly" />
                    <v-select
                        v-else-if="valueChoices[subItemKey].type == 'select'"
                        :append-icon="getSelectIcon(subItemKey, 'append')"
                        :prepend-icon="getSelectIcon(subItemKey, 'prepend')"
                        :readonly="readonly"
                        :label="getSelectLabel(subItemKey)"
                        :items="valueChoices[subItemKey].values"
                        @change="updateValue(subItemKey, $event)"
                        :value="subItem"
                        hide-details
                        outlined
                        :dense="dense">
                        <template
                            slot="selection"
                            slot-scope="data">
                            <!-- HTML that describe how select should render selected items -->

                            <span>
                                {{ getSelectText(data.item) }}
                            </span>
                            <!-- <span v-else>
                            {{ data.value.toUpperCase() }}
                        </span> -->
                        </template>
                        <template
                            slot="item"
                            slot-scope="data">
                            <!-- HTML that describe how select should render items when the select is open -->
                            <span>
                                {{ getSelectText(data.item) }}
                            </span>
                            <!-- <span v-else>
                            {{ data.value.toUpperCase() }}
                        </span> -->
                        </template>
                    </v-select>
                    <v-autocomplete
                        v-else
                        :dense="dense"
                        hide-details
                        outlined
                        :label="getSelectLabel(subItemKey)"
                        :readonly="readonly"
                        :value="subItem"
                        @change="updateValue(subItemKey, $event)"
                        :items="LDAPCountries"
                        :rules="[v => { return valueChoices[subItemKey].values.includes(v) || subItem != undefined && subItem.length == 0 }]">
                    </v-autocomplete>
                </v-col>
            </v-list-item-content>
            <v-list-item-action :class="actionButtonClasses">
                <v-btn
                    color="primary"
                    :class="'ml-2 ' + (complexValidator ? 'mb-7' : '')"
                    :disabled="readonly == true || isFieldDisabled(subItemKey) || !isFieldDeletable(subItemKey)"
                    v-show="!disableAddDelete"
                    @click="removeFromObject(subItemKey)"
                    rounded
                    small
                    icon>
                    <v-icon small>
                        mdi-minus
                    </v-icon>
                </v-btn>
            </v-list-item-action>
        </v-list-item>
    </div>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import LDAPCountries from '@/include/constants/LDAPCountries.js';

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
    mixins: [validationMixin, utilsMixin],
    data() {
        return {
            LDAPCountries: LDAPCountries,
            ...this.getInitialData()
        }
    },
    props: {
        value: Object,
        reorder: Boolean,
        label: String,
        dense: {
            type: Boolean,
            default: true
        },
        disableAddDelete: {
            type: Boolean,
            default: false
        },
        showTitle: {
            type: Boolean,
            default: false
        },
        keyChoices: {
            type: Array,
            default: () => { return [] }
        },
        valueChoices: {
            type: Object,
            default: () => { return {} }
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
        persistentFields: {
            type: Array
        },
        allowEmptyFields: {
            type: Boolean,
            default: false
        },
        resettable: Boolean,
        complexValidator: Object,
        contentClass: {
            type: String,
            default: "ma-0 px-6 py-2 pt-4"
        }
    },
    emits: ['update:value'],
    created() {
        this.setObject()
        this.actionButtonClasses = "ma-0 pa-0 mx-1"
    },
    mounted() {
    },
    watch: {
        value(new_v) {
            this.objectToEdit = new_v
        },
        // keyToAdd(new_v){
        // console.log(new_v)
        // }
    },
    methods: {
        getInitialData() {
            return {
                objectToEdit: {},
                keyToAdd: "",
                valueToAdd: "",
            }
        },
        forceUpdate() {
            this.$nextTick(() => {
                this.$forceUpdate()
            })
        },
        setObject() {
            this.data = { ...this.data, ...this.getInitialData() }
            if (this.value != undefined)
                this.objectToEdit = this.value
            this.forceUpdate()
        },
        isFieldInComplexValidators(key) {
            if (this.complexValidator != undefined)
                return key in this.complexValidator
        },
        isFieldDisabled(key) {
            if (this.disabledFields != undefined)
                return this.disabledFields.includes(key)
        },
        isFieldDeletable(key) {
            if (this.deletableFields !== undefined && Array.isArray(this.deletableFields))
                return this.deletableFields.includes(key)
            return true
        },
        updateValue(k, v) {
            this.objectToEdit[k] = v
            this.updateObject()
        },
        addToObject(key, value) {
            if (this.keyToAdd.length < 1)
                return
            if (this.allowEmptyFields !== true)
                if (this.valueToAdd.length < 1)
                    return
            if (this.isFieldDisabled(key))
                return
            this.objectToEdit[key] = value
            this.valueToAdd = ""
            this.keyToAdd = ""
            this.updateObject()
        },
        removeFromObject(key) {
            delete this.objectToEdit[key];
            this.updateObject()
        },
        emitReset() {
            this.$emit('reset')
        },
        updateObject() {
            this.$emit('update', this.objectToEdit)
            this.forceUpdate()
        },
        moveItem(k, up = true) {
            var v = this.objectToEdit[k]
            var idx = Object.keys(this.objectToEdit).indexOf(k)
            // Convert Object to Key Value Array
            let keyValues = Object.entries(this.objectToEdit);
            // Remove item from Key Value pairs
            keyValues.splice(idx, 1);

            if (up) {
                idx -= 1
                if (idx < 0)
                    idx = Object.keys(this.objectToEdit).length
            } else {
                idx += 1
                if (idx >= Object.keys(this.objectToEdit).length)
                    idx = 0
            }
            // Re-add at new index
            keyValues.splice(idx, 0, [k, v]);
            this.objectToEdit = Object.fromEntries(keyValues)
            this.updateObject()
        },
        getSelectLabel(subItemKey) {
            if (typeof this.valueChoices[subItemKey] !== 'object') return undefined
            if ('label' in this.valueChoices[subItemKey])
                return this.valueChoices[subItemKey]['label']
            return this.$t('words.value')
        },
        getSelectIcon(subItemKey, iconType) {
            const selectIconTypes = ['append', 'prepend']
            if (!selectIconTypes.includes(iconType)) return undefined
            if (typeof this.valueChoices[subItemKey] !== 'object') return undefined
            if (`${iconType}-icon` in this.valueChoices[subItemKey])
                return this.valueChoices[subItemKey][`${iconType}-icon`]
        },
        isChoicesField(subItemKey) {
            if (typeof this.valueChoices !== 'object') return false
            return subItemKey in this.valueChoices
        },
        getSelectText(subItemData) {
            if ('text_i18n' in subItemData) return this.$t(subItemData.text_i18n)
            if ('text' in subItemData) return subItemData.text
            if ('value' in subItemData) return subItemData.value
            if (!('item' in subItemData)) {
                throw new Error("Bad Value for choice field in ObjectEditor")
            }
            return subItemData.item
        },
    }
}
</script>
