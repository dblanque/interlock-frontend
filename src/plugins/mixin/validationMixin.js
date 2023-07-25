// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: validationMixin.js

import i18n from '@/i18n'

function calculateCUITVerifierDigit(cuitNum) {
  var validateSum = 0;
  var cuitRev = cuitNum.toString().slice(0, -1).split('').reverse().join(''); // 6480780402
  var currentSeriesDigit = 2;

  for (let currentDigitIndex = 0; currentDigitIndex < cuitRev.length; currentDigitIndex++) {
    var currentDigit = parseInt(cuitRev.substring(currentDigitIndex, currentDigitIndex+1));
    var seriesResult = currentDigit * currentSeriesDigit;
    validateSum += seriesResult;
    
    if (currentSeriesDigit < 7)
      currentSeriesDigit++
    else
      currentSeriesDigit = 2;
  }
  
  var validateModEleven = validateSum % 11;
  return validateModEleven;
}

function validateIPv4Address(v){
  return !v || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-4]|2[0-4][0-9]|[1]?[0-9][0-9]?)$/.test(v) || i18n.t("error.validation.ipv4Address")
}

/**
 * 
 * @param {string} v 
 * @param {boolean} brackets 
 * @returns true || i18n string
 */
function validateIPv6Address(v, brackets=false) {
  var ipv6_array
  var regex_ipv6 = /^[0-9a-fA-F]{0,4}:([0-9a-fA-F]{0,4}:){1,6}[0-9a-fA-F]{1,4}$/
  var regex_ipv6_ambiguity = /^.*::.*(::.*){1,}$/;
  ipv6_array = v.split(":");

  // URI Brackets Check
  if (brackets === true) {
    regex_ipv6 = /^\[{0,1}[0-9a-fA-F]{0,4}:([0-9a-fA-F]{0,4}:){1,6}[0-9a-fA-F]{1,4}\]{0,1}$/;
    if (!v.includes("[") || !v.includes("]"))
      return i18n.t("error.validation.ipv6AddressUri")
  }

  // Basic REGEX Check
  if (!regex_ipv6.test(v)) 
    return i18n.t("error.validation.ipv6Address")

  // Length Check
  if (ipv6_array.length > 8 || (ipv6_array.length <= 7 && !v.includes("::")) ) 
    return i18n.t("error.validation.ipv6AddressLength")

  // Ambiguity Check
  if (regex_ipv6_ambiguity.test(v)) 
    return i18n.t("error.validation.ipv6AddressAmbiguous")

  return true
}

/**
 * 
 * @param {string} v 
 * @param {boolean} uri 
 * @returns true || i18n string
 */
function validateIPAddress(v, uri=false) {
  if (/^.*[a-fA-F].*$/.test(v) || v.includes("[") || v.includes("]"))
    return validateIPv6Address(v, uri)
  return validateIPv4Address(v)
}

const validationMixin = {
    methods:{

      // * ------------------------------ Individual REGEX Input Rules ------------------------------ * //
      inputRulesRequired: (v) => (v != null && v != undefined && v.length != 0) ||  i18n.t("error.validation.fieldRequired"),
      inputRulesAboveZero: (v) => (parseInt(v) > 0) || i18n.t("error.validation.aboveZero"),
      inputRulesBelow10000: (v) => (parseInt(v) < 10000) || i18n.t("error.validation.below10000"),
      inputRulesLetters: (v) => !v || /^[üöñóúíáéa-zA-Z ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesLettersStrict: (v) => !v || /^[a-zA-Z ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesLettersStrictUnderscore: (v) => !v || /^[a-zA-Z_ ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesCountry: (v) => !v || /^[a-zA-Z'\s]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesNumbers: (v) => !v || /^[0-9.]{0,}$/.test(v) || i18n.t("error.validation.numeric"),
      inputRulesMax4: (v) => !v || /^.{1,4}$/.test(v) || i18n.t("error.validation.max4"),
      inputRulesMax6: (v) => !v || /^.{1,6}$/.test(v) || i18n.t("error.validation.max6"),
      inputRulesMax8: (v) => !v || /^.{1,8}$/.test(v) || i18n.t("error.validation.max8"),
      inputRulesMax255: (v) => !v || /^.{1,255}$/.test(v) || i18n.t("error.validation.max255"),
      inputRulesInt32: (v) => !v || /[0-9]{1,10}$/.test(v) && v < 4294967296 || i18n.t("error.validation.int32"),
      inputRulesNoDoubleQuotes: (v) => !v || /^[^"]+$/.test(v) || i18n.t("error.validation.doubleQuotes"),
      inputRulesNoSingleQuotes: (v) => !v || /^[^']+$/.test(v) || i18n.t("error.validation.singleQuotes"),
      inputRulesalphaNumericSpaces: (v) => !v || /^[üöñóúíáéa-z0-9]+[üöñóúíáéa-z0-9\s]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpaces"),
      inputRulesalphaNumericSpecial: (v) => !v || /^[üöñóúíáéa-z0-9]+[?¿!@üöñóúíáéa-z0-9,.\s_-]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecial"),
      inputRulesalphaNumericPassword: (v) => !v || /^[!@#$%&*()üöñóúíáéa-z0-9]+([!@#$%&*()üöñóúíáéa-z0-9,._-]{7,})+$/i.test(v) || i18n.t("error.validation.alphaNumericPassword"),
      inputRulesalphaNumericSpecialUsername: (v) => !v || /^[a-z0-9]+([a-z0-9_-]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecialUsername"),
      inputRulesalphaNumericSpecialCN: (v) => !v || /^[a-z0-9]+([a-z0-9_-\s]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecial"),
      inputRulesalphaNumericSpecialName: (v) => !v || /^[a-z0-9]+([a-z0-9_-\s]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecial"),

      // ASCII Source
      // https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
      inputRulesFullASCIISet: (v) => !v || /^[\x20-\x7E]*$/.test(v) || i18n.t("error.validation.ascii"),

      inputRulesDN: (v) => !v || /^(?:[A-Za-z][\w-]*|\d+(?:\.\d+)*)=(?:#(?:[\dA-Fa-f]{2})+|(?:[^,=+<>#;\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*|"(?:[^\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*")(?:\+(?:[A-Za-z][\w-]*|\d+(?:\.\d+)*)=(?:#(?:[\dA-Fa-f]{2})+|(?:[^,=+<>#;\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*|"(?:[^\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*"))*(?:,(?:[A-Za-z][\w-]*|\d+(?:\.\d+)*)=(?:#(?:[\dA-Fa-f]{2})+|(?:[^,=+<>#;\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*|"(?:[^\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*")(?:\+(?:[A-Za-z][\w-]*|\d+(?:\.\d+)*)=(?:#(?:[\dA-Fa-f]{2})+|(?:[^,=+<>#;\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*|"(?:[^\\"]|\\[,=+<>#;\\"]|\\[\dA-Fa-f]{2})*"))*)*$/i.test(v) || i18n.t("error.validation.distinguishedName"),
      inputRulesDomain: (v) => !v || /^((?:http(?:s){0,5}(:\/\/){0,1}){0,1}(?:[a-zA-Z0-9-\\.]){2,61}(?:\.[a-zA-Z]{2,})+)?$/.test(v) || i18n.t("error.validation.domain"),
      inputRulesDomainCanonical: (v) => !v || /^(((?:[a-zA-Z0-9-.]){2,61}(?:\.[a-zA-Z]{2,})+|(?:[a-zA-Z0-9-]){2,63}))\.$/.test(v) || i18n.t("error.validation.domainCanonical"),
      inputRulesDomainNonTLD: (v) => !v || /^(((?:[a-zA-Z0-9-.]){2,61}(?:\.[a-zA-Z]{2,})+|(?:[a-zA-Z0-9-]){2,64}))?$/.test(v) || i18n.t("error.validation.domain"),
      inputRulesDomainRoot: (v) => !v || /^(((?:[a-zA-Z0-9-.]){2,61}(?:\.[a-zA-Z]{2,})+|(?:[a-zA-Z0-9-]){2,64})|[@]{1})?$/.test(v) || i18n.t("error.validation.domainRoot"),
      inputRulesEmail: (v) => !v || /^([a-zA-Z0-9._-]{2,64})@(?:[a-zA-Z0-9-\\.]){2,61}(?:\.[a-zA-Z]{2,})+$/.test(v) || i18n.t("error.validation.email"),
      inputRulesUSN: (v) => !v || /^([a-zA-Z0-9._-]{2,64})@(?:[a-zA-Z0-9-\\.]){2,61}((?:[a-zA-Z0-9-]){2,61})+$/.test(v) || i18n.t("error.validation.usn"),
      // inputRulesIPv4: (v) => !v || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-4]|2[0-4][0-9]|[1]?[0-9][0-9]?)$/.test(v) || i18n.t("error.validation.ipv4Address"),
      // inputRulesIPv6: (v) => !v || /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(v) || i18n.t("error.validation.ipv6Address"),
      inputRulesREALM: (v) => !v || /^[A-Z]{1,15}$/.test(v) || i18n.t("error.validation.realm"),
      inputRulesPORT: (v) => !v || /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(v) || i18n.t("error.validation.ldapURI_PORT"),
      inputRuleTOTP: (v) => !v || /^[0-9]{6}$/.test(v) || i18n.t("error.validation.totpLength"),

      // Phone Regex Rules
      //inputRulesPhone: (v) => !v || /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(v) || /.+[0-9]{2}[0-9]{1,2}[0-9]{2}[0-9]{4}[0-9]{4}/.test(v) || i18n.t("error.validation.phone"),
      inputRulesPhone: (v) => !v || /^\+?\d$/.test(v) || i18n.t("error.validation.phone"), // Basic phone validation (Has a plus and digits?)
      inputRulesPhone_ext: (v) => {
        var message = true;
        if  ( v && 
              ( 
              !/^\+54(\s|-)?9?(\s|-)?11(\s|-)?[0-9]{4}(\s|-)?[0-9]{4}$/.test(v) && // +54 9 11 0000 0000
              !/^\+54(\s|-)?9?(\s|-)?(2[0-9]{2}|3[0-9]{2})(\s|-)?[0-9]{3,4}(\s|-)?[0-9]{4}$/.test(v) && // +54 9 2xx 000(0) 0000
              !/^\+54(\s|-)?9?(\s|-)?(2[0-9]{3}|3[0-9]{3})(\s|-)?[0-9]{3}(\s|-)?[0-9]{3}$/.test(v)  // +54 9 2xxx 000 000
              )
            ) {
          message = i18n.t("error.validation.phone");
        }
        return message;
      },

      inputRulesCBU: (v) => {
        var message = true;
        if  ( v && !/^[0-9]{22}$/.test(v) ) {
          message = i18n.t("error.validation.cbu");
        }
        return message;
      },

      inputRulesIPv4: (v) => {
        return validateIPv4Address(v)
      },

      inputRulesIPv6: (v) => {
        return validateIPv6Address(v)
      },

      inputRulesIPv6Brackets: (v) => {
        return validateIPv6Address(v, true)
      },

      inputRulesIP: (v) => {
        return validateIPAddress(v)
      },

      inputRulesIP_URI: (v) => {
        return validateIPAddress(v, true)
      },
      
      // inputRulesCUITFormat: (v) => !v || /(^([0-9]{2})-([0-9]{8})-([0-9]{1}))|(^[0-9]{11})$/i.test(v) || i18n.t("error.validation.cuitFormat"),
      inputRulesDNIMatchesCUIT: (cuit, dni, compareCuitAndDNI) => {
        if (cuit && !/(^([0-9]{2})-([0-9]{8})-([0-9]{1}))|(^[0-9]{11})$/i.test(cuit)) {
          return i18n.t("error.validation.cuitFormat");
        }

        var cuitNum = cuit.replace(/-/g, ""); // 20408708460
        var cuitPrefix = parseInt(String(cuitNum.substr(0, 2)));
        var cuitMiddle = parseInt(String(cuitNum.substr(2, 8)));
        var cuitVerifDigit = parseInt(String(cuitNum.substr(-1))); // 2040870846

        var validateModEleven = calculateCUITVerifierDigit(cuitNum);
        var elevenMinus = 11 - validateModEleven;
        var result = elevenMinus;

        switch (elevenMinus) {
          case 11:
            result = 0;
            break;
          case 10:
            result = 1;
            break;
          case 0:
            if (cuitPrefix == 20 || cuitPrefix == 27 || cuitPrefix == 24) {
              cuitPrefix=23;
              cuitNum=cuitPrefix + cuitMiddle + cuitVerifDigit;
              validateModEleven = calculateCUITVerifierDigit(cuitNum);
              elevenMinus = 11 - validateModEleven;
              result = elevenMinus;
            } else if (cuitPrefix == 30 || cuitPrefix == 34) {
              cuitPrefix=33;
              cuitNum=cuitPrefix + cuitMiddle + cuitVerifDigit;
              validateModEleven = calculateCUITVerifierDigit(cuitNum);
              elevenMinus = 11 - validateModEleven;
              result = elevenMinus;
            }
            break;
          default:
            result = elevenMinus
            break;
        }

        if (result != cuitVerifDigit)
          return i18n.t("error.validation.cuitFormat");

        if (compareCuitAndDNI == true) {
          if ( cuitPrefix + dni + cuitVerifDigit != cuitNum ) {
            return i18n.t("error.validation.dniNotInCuit");
          }
        }
        return true
      },

      /**
       * fieldRules(v, fieldName, isRequired)
       * 
       * @param v Field value to validate - String | Resource
       * @param fieldName Field class type defined in function switch - String
       * @param isRequired Whether the field is required or not - Boolean Flag [true | false]
       *
       * fieldName naming convention: class + field
       * Example: Generic Email => ge_email
       * Example: Customer Email => cu_email
      */
      fieldRules(v, fieldName, isRequired) {
        var message = true;
        var rules=[];
        var v_array=[];

        if (fieldName == null || fieldName == undefined || fieldName.length == 0) {
          console.log("fieldRules(): fieldName is not set.")
          return "fieldRules(): fieldName is not set."
        }

        // Adds required input Rule if it's passed from parameter
        if (isRequired == true || (isRequired != null && isRequired.length > 0)) {
          // console.log(fieldName+' is required')
          rules.push(this.inputRulesRequired);
        }

        // ----------------- Centralized rule management for input field types ----------------- //
        // * ------------------------------ Add your rules here ------------------------------ * //
        switch (fieldName) {
          // Generic Field Rules
          case "ge_lettersStrictUnderscore": // Generic
            rules.push(this.inputRulesLettersStrictUnderscore)
            break;
          case "ge_lettersStrict": // Generic
            rules.push(this.inputRulesLettersStrict)
            break;
          case "ge_numbers": // Generic INT Field
            rules.push(this.inputRulesNumbers)
            break;
          case "ge_name": // Generic Name Field
            rules.push(this.inputRulesalphaNumericSpecialName)
            break;
          case "ge_cn": // Generic Common Name
            rules.push(this.inputRulesalphaNumericSpecialCN)
            break;
          case "ge_integer": // Generic Integer Field
            rules.push(this.inputRulesAboveZero)
            break;
          case "ge_int32":
            rules.push(this.inputRulesInt32)
            break;
          case "ge_username": // Generic Username Field
            rules.push(this.inputRulesalphaNumericSpecialUsername)
            break;
          case "ge_password": // Generic Password Field
            rules.push(this.inputRulesalphaNumericPassword)
            break;
          case "ldap_dn": // LDAP Distinguished Name validator
            rules.push(this.inputRulesDN)
            break;
          case "net_ipv4": // IPv4 Validation
            rules.push(this.inputRulesIPv4)
            break;
          case "net_ipv6": // IPv6 Validation
            rules.push(this.inputRulesIPv6)
            break;
          case "net_ip_uri": // IPv4/6 Validation (IPv6 with brackets)
            rules.push(this.inputRulesIP_URI)
            break;
          case "net_ip": // IPv4/6 Validation
            rules.push(this.inputRulesIP)
            break;
          case "net_port": // LDAP Realm validator
            rules.push(this.inputRulesPORT)
            break;
          case "net_domain_canonical": // LDAP Domain validator
            rules.push(this.inputRulesDomainCanonical)
            break;
          case "ldap_realm": // LDAP Realm validator
            rules.push(this.inputRulesREALM)
            break;
          case "ldap_website": // LDAP Domain validator
            rules.push(this.inputRulesDomainNonTLD)
            break;
          case "ldap_usn": // LDAP User Principal Name validator
            rules.push(this.inputRulesUSN)
            break;
          case "ge_message": // Generic Name Field
            rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_topic": // Generic Name Field
            rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_email": // E-mail
          case "ge_mail":
            rules.push(this.inputRulesEmail);
            break;
          case "ge_fiscal_number": // CUIT
            rules.push(this.inputRulesDNIMatchesCUIT)
              break;
          case "ge_phone":
            rules.push(this.inputRulesPhone_ext)
            break;
          case "ge_website":
            rules.push(this.inputRulesDomain)
            break;
          case "ge_address_street": // Address Street
            rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_price":
          case "ge_address_number": // Address Number
            rules.push(this.inputRulesNumbers)
            break;
          case "ge_address_floor": // Address Floor
            rules.push(this.inputRulesalphaNumericSpaces, this.inputRulesMax4)
            break;
          case "ge_address_apartment": // Address Apartment
            rules.push(this.inputRulesalphaNumericSpaces, this.inputRulesMax6)
            break;
          case "ge_address_postal_code": // Address Postal Code
            rules.push(this.inputRulesalphaNumericSpaces, this.inputRulesMax8)
            break;
          case "ge_address_city": // Address City
            rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_state": // State
            rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_type":
            rules.push(this.inputRulesLetters)
            break;
          case "ge_country": // Country
            rules.push(this.inputRulesCountry)
            break;
          case "ge_ascii": // ASCII Only
            rules.push(this.inputRulesFullASCIISet)
            break;
          case "dns_stringData": // StringData
            rules.push(this.inputRulesFullASCIISet, this.inputRulesNoDoubleQuotes, this.inputRulesMax255)
            break;
          case "dns_root": // DNS Root Validation
            rules.push(this.inputRulesDomainRoot)
            break;
          case "set_log_max": // DNS Root Validation
            rules.push(this.inputRulesAboveZero, this.inputRulesBelow10000, this.inputRulesNumbers)
            break;
          case "auth_totp":
            rules.push(this.inputRulesNumbers, this.inputRuleTOTP)
            break;
          case "auth_recovery":
            rules.push(this.inputRulesalphaNumericSpecialCN)
            break;
          default:
            break;
        }

        // For every rule in rules array...
        for (var rule in rules) {
          try {
          // If the rule is inputRules Required
          if (rule == this.inputRulesRequired) {
              var val = Array.isArray(v) ? v[0] : v;
              message = rules[rule](val);
          } 
          // Every other rule
          else {
              // If an array of values is passed to the input rule - This was necessary to fix undefined / null errors
              if (Array.isArray(v)) {
                v_array = [ ...(v || []) ];
                for (let index = 0; index < v_array.length; index++) {
                  if (!v_array[index])
                    v_array[index] = '';
                }
                if ( rules[rule](...v_array) != true && message == true )
                  message = rules[rule](...v_array);
              } 
              // If a single value is passed to the input rule do the normal thing
              else { 
                if (!v)
                  v = '';
                if ( rules[rule](v) != true && message == true )
                  message = rules[rule](v);
              }
            }
          } catch (error) {
            console.log(rule)
            console.error(error)
          }
        }
        return message;
      },
      
      // Keep these for easier development and fewer brainfucks - Recommend testing with Regex101 on ECMAScript set
      // inputRulesPhonePre1: (v) => !v || /^\+54(\s|-)?9?(\s|-)?11(\s|-)?[0-9]{4}(\s|-)?[0-9]{4}$/.test(v) || i18n.t("error.validation.phonePre1"),
      // inputRulesPhonePre2: (v) => !v || /^\+54(\s|-)?9?(\s|-)?(2[0-9]{2}|3[0-9]{2})(\s|-)?[0-9]{3}(\s|-)?[0-9]{4}$/.test(v) || i18n.t("error.validation.phonePre2"),
      // inputRulesPhonePre3: (v) => !v || /^\+54(\s|-)?9?(\s|-)?(2[0-9]{3}|3[0-9]{3})(\s|-)?[0-9]{3}(\s|-)?[0-9]{3}$/.test(v) || i18n.t("error.validation.phonePre3"),
      getCountryList() { return [
          "Afghanistan",
          "Albania",
          "Algeria",
          "American Samoa",
          "Andorra",
          "Angola",
          "Anguilla",
          "Antarctica",
          "Antigua and Barbuda",
          "Argentina",
          "Armenia",
          "Aruba",
          "Australia",
          "Austria",
          "Azerbaijan",
          "Bahamas",
          "Bahrain",
          "Bangladesh",
          "Barbados",
          "Belarus",
          "Belgium",
          "Belize",
          "Benin",
          "Bermuda",
          "Bhutan",
          "Bolivia",
          "Bonaire",
          "Bosnia and Herzegovina",
          "Botswana",
          "Bouvet Island",
          "Brazil",
          "British Indian Ocean Territory",
          "Brunei Darussalam",
          "Bulgaria",
          "Burkina Faso",
          "Burundi",
          "Cambodia",
          "Cameroon",
          "Canada",
          "Cape Verde",
          "Cayman Islands",
          "Central African Republic",
          "Chad",
          "Chile",
          "China",
          "Christmas Island",
          "Cocos (Keeling) Islands",
          "Colombia",
          "Comoros",
          "Congo",
          "Democratic Republic of the Congo",
          "Cook Islands",
          "Costa Rica",
          "Croatia",
          "Cuba",
          "Curacao",
          "Cyprus",
          "Czech Republic",
          "Cote d'Ivoire",
          "Denmark",
          "Djibouti",
          "Dominica",
          "Dominican Republic",
          "Ecuador",
          "Egypt",
          "El Salvador",
          "Equatorial Guinea",
          "Eritrea",
          "Estonia",
          "Ethiopia",
          "Islas Malvinas",
          "Faroe Islands",
          "Fiji",
          "Finland",
          "France",
          "French Guiana",
          "French Polynesia",
          "French Southern Territories",
          "Gabon",
          "Gambia",
          "Georgia",
          "Germany",
          "Ghana",
          "Gibraltar",
          "Greece",
          "Greenland",
          "Grenada",
          "Guadeloupe",
          "Guam",
          "Guatemala",
          "Guernsey",
          "Guinea",
          "Guinea-Bissau",
          "Guyana",
          "Haiti",
          "Heard Island and McDonald Islands",
          "Holy See (Vatican City State)",
          "Honduras",
          "Hong Kong",
          "Hungary",
          "Iceland",
          "India",
          "Indonesia",
          "Islamic Republic of Iran",
          "Iraq",
          "Ireland",
          "Isle of Man",
          "Israel",
          "Italy",
          "Jamaica",
          "Japan",
          "Jersey",
          "Jordan",
          "Kazakhstan",
          "Kenya",
          "Kiribati",
          "Democratic People's Republic of Korea",
          "Kuwait",
          "Kyrgyzstan",
          "Lao People's Democratic Republic",
          "Latvia",
          "Lebanon",
          "Lesotho",
          "Liberia",
          "Libya",
          "Liechtenstein",
          "Lithuania",
          "Luxembourg",
          "Macao",
          "Former Yugoslav Republic of Macedonia",
          "Madagascar",
          "Malawi",
          "Malaysia",
          "Maldives",
          "Mali",
          "Malta",
          "Marshall Islands",
          "Martinique",
          "Mauritania",
          "Mauritius",
          "Mayotte",
          "Mexico",
          "Federated States of Micronesia",
          "Republic of Moldova",
          "Monaco",
          "Mongolia",
          "Montenegro",
          "Montserrat",
          "Morocco",
          "Mozambique",
          "Myanmar",
          "Namibia",
          "Nauru",
          "Nepal",
          "Netherlands",
          "New Caledonia",
          "New Zealand",
          "Nicaragua",
          "Niger",
          "Nigeria",
          "Niue",
          "Norfolk Island",
          "Northern Mariana Islands",
          "Norway",
          "Oman",
          "Pakistan",
          "Palau",
          "State of Palestine",
          "Panama",
          "Papua New Guinea",
          "Paraguay",
          "Peru",
          "Philippines",
          "Pitcairn",
          "Poland",
          "Portugal",
          "Puerto Rico",
          "Qatar",
          "Romania",
          "Russian Federation",
          "Rwanda",
          "Reunion",
          "Saint Barthelemy",
          "Saint Helena",
          "Saint Kitts and Nevis",
          "Saint Lucia",
          "Saint Martin (French part)",
          "Saint Pierre and Miquelon",
          "Saint Vincent and the Grenadines",
          "Samoa",
          "San Marino",
          "Sao Tome and Principe",
          "Saudi Arabia",
          "Senegal",
          "Serbia",
          "Seychelles",
          "Sierra Leone",
          "Singapore",
          "Sint Maarten (Dutch part)",
          "Slovakia",
          "Slovenia",
          "Solomon Islands",
          "Somalia",
          "South Africa",
          "South Georgia and the South Sandwich Islands",
          "South Sudan",
          "Spain",
          "Sri Lanka",
          "Sudan",
          "Suriname",
          "Svalbard and Jan Mayen",
          "Swaziland",
          "Sweden",
          "Switzerland",
          "Syrian Arab Republic",
          "Taiwan, Province of China",
          "Tajikistan",
          "United Republic of Tanzania",
          "Thailand",
          "Timor-Leste",
          "Togo",
          "Tokelau",
          "Tonga",
          "Trinidad and Tobago",
          "Tunisia",
          "Turkey",
          "Turkmenistan",
          "Turks and Caicos Islands",
          "Tuvalu",
          "Uganda",
          "Ukraine",
          "United Arab Emirates",
          "United Kingdom",
          "United States",
          "United States Minor Outlying Islands",
          "Uruguay",
          "Uzbekistan",
          "Vanuatu",
          "Venezuela",
          "Vietnam",
          "British Virgin Islands",
          "US Virgin Islands",
          "Wallis and Futuna",
          "Western Sahara",
          "Yemen",
          "Zambia",
          "Zimbabwe",
      ]
      },
  }
}
export default validationMixin;

// Vuelidate Documentation - https://vuelidate.js.org/#sub-regex-based-validator
// Domain validation - https://stackoverflow.com/questions/26093545/how-to-validate-domain-name-using-regex/38578855
// Original Regex: 
// ^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$