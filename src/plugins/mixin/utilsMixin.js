
const utilsMixin = {
    methods:{
        getMessageForCode(errorData=undefined){
            var suffix

            if (errorData == undefined) {
            console.log('Error Data is undefined')
            return this.$t("error.unknown_short")
            }

            if (typeof errorData == "string")
            console.error("The Error Data Object must be passed to this function, not a string")

            console.log(errorData)

            var codeToUse
            if (typeof errorData === 'string')
                codeToUse = errorData
            else if ('code_ext' in errorData.response.data)
                codeToUse = errorData.response.data.code_ext
            else if ('code' in errorData.response.data)
                codeToUse = errorData.response.data.code
            else
                codeToUse = errorData.status_code

            if (codeToUse.length < 40)
            suffix = " (" + codeToUse + ")"
            else
            suffix = " (" + codeToUse.substring(0, 40) + "...)"

            switch(codeToUse){
            case 405:
                return this.$t('error.codes.badRequest')
            case 409:
                return this.$t('error.codes.conflict')
            case 'ERR_NETWORK':
                return this.$t('error.codes.networkError')
            case 'entryAlreadyExists':
            case 'ldap_obj_exists':
                return this.$t('error.codes.ldapObjectExists')
            // DNS ---------------------------------------------------------- //
            case 'dns_zone_missing':
            case 'dns_zone_in_record':
            case 'dns_zone_not_deletable':
            case 'dns_zone_exists':
            case 'dns_zone_does_not_exist':
            case 'dns_record_not_in_request':
            case 'dns_record_dn_missing':
            case 'dns_record_type_conflict':
            case 'dns_record_exists_conflict':
            case 'dns_record_type_unsupported':
            case 'dns_record_attr_missing':
            case 'dns_record_type_missing':
            case 'dns_record_data_does_not_match':
            case 'dns_record_entry_does_not_exist':
            case 'dns_soa_increment':
            case 'dns_soa_record_root_only':
            case 'dns_root_servers_only_cli':
            case 'dns_field_validator_failed':
                var result = this.$t('error.codes.dns.'+codeToUse)
                return result
            // -------------------------------------------------------------- //
            case null:
            case undefined:
            case "":
            default:
                if (codeToUse in this.$t('error.codes'))
                    return this.$t('error.codes.'+codeToUse)
                else
                    return this.$t("error.unknown_short") + suffix
            }
        },

        // Check if theme is dark
        isThemeDark(vuetify) {
        if (vuetify.theme.dark === true) {
            return true;
        }
        return false;
        },

        sortNullLast(items, index, isDesc) {
        items.sort((a, b) => {
            if (a[index] === b[index]) { // equal items sort equally
            return 0;
            } else if (a[index] === null || a[index] === '') { // nulls sort after anything else
            return 1;
            } else if (b[index] === null || b[index] === '') {
            return -1;
            } else if (!isDesc[0]) { // otherwise, if we're ascending, lowest sorts first
            return a[index] < b[index] ? -1 : 1;
            } else { // if descending, highest sorts first
            return a[index] < b[index] ? 1 : -1;
            }
        });
        return items;
        }
    }
}

export default utilsMixin;