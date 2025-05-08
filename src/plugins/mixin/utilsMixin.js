// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: utilsMixin.js

const utilsMixin = {
    methods: {
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        toCamelCase(e) {
            return e.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        },
        toSnakeCase(e) {
            if (e.toLowerCase() === e) {
                return e;
            }
            return e.match(/([A-Z])/g).reduce(
                (str, c) => str.replace(new RegExp(c), '_' + c.toLowerCase()),
                e
            )
                .substring((e.slice(0, 1).match(/([A-Z])/g)) ? 1 : 0);
        },
        toPropCase(e) {
            if (e.toLowerCase() === e) {
                return e;
            }
            return e.match(/([A-Z])/g).reduce(
                (str, c) => str.replace(new RegExp(c), '-' + c.toLowerCase()),
                e
            )
                .substring((e.slice(0, 1).match(/([A-Z])/g)) ? 1 : 0);
        },
        // ----------------------------- LDAP Permissions ----------------------------- //
        calcEnabledPermissions(permissionList) {
            let result = 0
            if (!permissionList) return result
            for (const [key] of Object.entries(permissionList)) {
                if (permissionList[key].value == true) {
                    result += permissionList[key].int
                }
            }
            return result
        },
        getEnabledPermissions(permissionList) {
            let result = []
            if (!permissionList) return result
            for (const [key] of Object.entries(permissionList)) {
                if (!(key in permissionList)) {
                    console.error(`${key} not in Permission list.`)
                    continue
                }
                if (permissionList[key].value == true)
                    result.push(key)
            }
            return result
        },
        // ---------------------------------------------------------------------------- //
        arraysAreEqual: function (a, b, sort) {
            let a_clone = structuredClone(a)
            if (sort == true) a_clone.sort()
            let b_clone = structuredClone(b)
            if (sort == true) b_clone.sort()
            return JSON.stringify(a_clone) === JSON.stringify(b_clone)
        },
        isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
        },
        isNumber: function (evt) {
            // TODO - Analyze Clipboard data besides standard keypress events
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;
            // Writing characters
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else if (evt.clipboardData != undefined && isNaN(evt.clipboardData.getData('Text'))) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getResponseErrorCode(errorData) {
            let codeToUse = "ERR_UNKNOWN_SHORT"
            if (errorData === undefined)
                console.log("getResponseErrorCode(): No error data passed.")

            if (typeof errorData === "string")
                return errorData

            if (typeof errorData === "object") {
                if (errorData.response &&
                    errorData.response.data != undefined &&
                    errorData.response.data != null &&
                    errorData.response.data instanceof Object) {
                    if ('ldap_response' in errorData.response.data)
                        codeToUse = errorData.response.data.ldap_response.description
                    else if ('code' in errorData.response.data)
                        codeToUse = errorData.response.data.code
                }
                else if ('code' in errorData)
                    codeToUse = errorData.code
                else if ('status_code' in errorData)
                    codeToUse = errorData.status_code
                else if ('response' in errorData && 'status' in errorData.response)
                    codeToUse = errorData.response.status
            }

            return (codeToUse)
        },
        getMessageForCode(error) {
            let codeToUse = this.getResponseErrorCode(error)
            let suffix

            if (codeToUse != undefined && codeToUse != null) {
                if (typeof codeToUse !== 'string')
                    codeToUse = toString(codeToUse)

                if (codeToUse.length < 40)
                    suffix = ` (${codeToUse})`
                else
                    suffix = ` (${codeToUse.substring(0, 40)}...)`
            }

            // Attempt to cast to numeric
            if (this.isNumeric(codeToUse))
                codeToUse = Number(codeToUse)
            // OTP ---------------------------------------------------------- //
            if (/^otp_.*/.test(codeToUse))
                return this.$t('error.codes.otp.' + codeToUse)
            // DNS ---------------------------------------------------------- //
            else if (/^dns_.*/.test(codeToUse))
                return this.$t('error.codes.dns.' + codeToUse)
            else if (/^user_.*/.test(codeToUse))
                return this.$t('error.codes.users.' + codeToUse)
            else if (/^ldap_.*/.test(codeToUse))
                return this.$t('error.codes.ldap.' + codeToUse)
            else if (/^group_.*/.test(codeToUse))
                return this.$t('error.codes.groups.' + codeToUse)
            else if (/^setting_.*/.test(codeToUse))
                return this.$t('error.codes.settings.' + codeToUse)
            else if (/^application_.*/.test(codeToUse))
                return this.$t('error.codes.applications.' + codeToUse)
            else if (/^oidc_.*/.test(codeToUse))
                return this.$t('error.codes.oidc.' + codeToUse)
            else
                switch (codeToUse) {
                    case 'ERR_UNKNOWN':
                        return this.$t("error.unknown")
                    case 'ERR_UNKNOWN_SHORT':
                        return this.$t("error.unknown_short")
                    case 'ERR_LDAP_GW':
                        return this.$t('error.codes.ldapGwError')
                    case 400:
                    case 'bad_request':
                    case 'ERR_BAD_REQUEST':
                    case 'data_key_missing':
                        return this.$t('error.codes.400')
                    case 403:
                    case 'permission_denied':
                        return this.$t('error.codes.403')
                    case 406:
                    case 'not_acceptable':
                        return this.$t('error.codes.406')
                    case 500:
                    case 'ERR_SERV_ERROR':
                    case 'ERR_BAD_RESPONSE':
                        return this.$t('error.codes.500')
                    case 'access_token_invalid':
                    case 'refresh_token_expired':
                    case 'unauthorized':
                        return this.$t('error.codes.401')
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
                        console.log("Unknown Error Code: " + codeToUse)
                        if (codeToUse in this.$t('error.codes'))
                            return this.$t('error.codes.' + codeToUse)
                        else {
                            var msg = this.$t("error.unknown_short")
                            if (suffix != undefined && suffix != null && codeToUse != msg)
                                msg = msg + suffix
                            return msg
                        }
                }
        },

        // Check if theme is dark
        isThemeDark(vuetify) {
            if (vuetify.theme.dark === true)
                return true;
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
        },
    }
}

export default utilsMixin;