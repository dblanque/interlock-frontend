
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

            var codeToUse
            if (typeof errorData === 'string')
            codeToUse = errorData
            else if ('code_ext' in errorData)
            codeToUse = errorData.code_ext
            else if ('code' in errorData)
            codeToUse = errorData.code
            else
            codeToUse = errorData.status_code

            console.log(codeToUse)

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
            case null:
            case undefined:
            case "":
            default:
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