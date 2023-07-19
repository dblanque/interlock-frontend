// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: utilsMixin.js

const utilsMixin = {
    methods:{
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getResponseErrorCode(errorData=undefined) {
            if (errorData == undefined) {
                console.log('Error Data is undefined')
                return this.$t("error.unknown_short")
            }

            if (typeof errorData == "string")
                return errorData

            var codeToUse
            if (errorData.response.data != undefined && errorData.response.data != null){
                if ('ldap_response' in errorData.response.data)
                    codeToUse = errorData.response.data.ldap_response.description
                else if ('code' in errorData.response.data)
                    codeToUse = errorData.response.data.code
            }
            else if ('code' in errorData)
                codeToUse = errorData.code
            else
                codeToUse = errorData.status_code

            return(codeToUse)
        },
        getMessageForCode(error=undefined){
            var codeToUse = this.getResponseErrorCode(error)
            var suffix

            if(codeToUse != undefined && codeToUse != null){
                if (codeToUse.length < 40)
                suffix = " (" + codeToUse + ")"
                else
                suffix = " (" + codeToUse.substring(0, 40) + "...)"
            }

            // OTP ---------------------------------------------------------- //
            if (/otp_.*/.test(codeToUse))
                return this.$t('error.codes.otp.'+codeToUse)
            // DNS ---------------------------------------------------------- //
            else if (/dns_.*/.test(codeToUse))
                return this.$t('error.codes.dns.'+codeToUse)
            else
                switch(codeToUse){
                case 'ERR_LDAP_GW':
                    return this.$t('error.codes.ldapGwError')
                case 405:
                case 'ERR_BAD_RESPONSE':
                    return this.$t('error.codes.badRequest')
                case 'ERR_INVALID_CSV':
                    return this.$t('error.codes.invalidCSV')
                case 'ERR_INVALID_CSV_HEADERS':
                    return this.$t('error.codes.invalidCSVHeaders')
                case 'ERR_FILEREADER':
                    return this.$t('error.codes.fileReader')
                case 409:
                    return this.$t('error.codes.conflict')
                case 'ERR_NETWORK':
                    return this.$t('error.codes.networkError')
                case 'entryAlreadyExists':
                case 'ldap_obj_exists':
                    return this.$t('error.codes.ldapObjectExists')
                case 'namingViolation':
                    return this.$t('error.codes.namingViolation')
                    // Users -------------------------------------------------------- //
                case 'noUsersInImport':
                    return this.$t('error.codes.users.noUsersInImport')
                // -------------------------------------------------------------- //
                case null:
                case undefined:
                case "":
                default:
                    console.log("Unknown Error Code:"+codeToUse)
                    if (codeToUse in this.$t('error.codes'))
                        return this.$t('error.codes.'+codeToUse)
                    else {
                        var msg = this.$t("error.unknown_short")
                        if (suffix != undefined && suffix != null)
                            msg = msg + suffix
                        return msg
                    }
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