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

const validationMixin = {
    methods:{

      // * ------------------------------ Individual REGEX Input Rules ------------------------------ * //
      inputRulesRequired: (v) => (v != null && v != undefined && v.length != 0) ||  i18n.t("error.validation.fieldRequired"),
      inputRulesAboveZero: (v) => (parseInt(v) > 0) || "Fields must be larger than 0",
      inputRulesLetters: (v) => !v || /^[üöñóúíáéa-zA-Z ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesLettersStrict: (v) => !v || /^[a-zA-Z ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesLettersStrictUnderscore: (v) => !v || /^[a-zA-Z_ ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesCountry: (v) => !v || /^[a-zA-Z'\s]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesNumbers: (v) => !v || /^[0-9.]{0,}$/.test(v) || i18n.t("error.validation.numeric"),
      inputRulesMax4: (v) => !v || /^.{1,4}$/.test(v) || i18n.t("error.validation.max4"),
      inputRulesMax6: (v) => !v || /^.{1,6}$/.test(v) || i18n.t("error.validation.max6"),
      inputRulesMax8: (v) => !v || /^.{1,8}$/.test(v) || i18n.t("error.validation.max8"),
      inputRulesAlphanumeric: (v) => !v || /^[üöñóúíáéa-zA-Z0-9]{0,}$/.test(v) || i18n.t("error.validation.alphaNumeric"),
      inputRulesalphaNumericSpaces: (v) => !v || /^[üöñóúíáéa-z0-9]+[üöñóúíáéa-z0-9\s]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpaces"),
      inputRulesalphaNumericSpecial: (v) => !v || /^[üöñóúíáéa-z0-9]+[?¿!@üöñóúíáéa-z0-9,.\s_-]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecial"),
      inputRulesalphaNumericPassword: (v) => !v || /^[!@#$%&*()üöñóúíáéa-z0-9]+([!@#$%&*()üöñóúíáéa-z0-9,._-]{7,})+$/i.test(v) || i18n.t("error.validation.alphaNumericPassword"),
      inputRulesalphaNumericSpecialUsername: (v) => !v || /^[a-z0-9]+([a-z0-9_-]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecialUsername"),
      inputRulesalphaNumericSpecialCN: (v) => !v || /^[a-z0-9]+([a-z0-9_-\s]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecialUsername"),
      inputRulesalphaNumericSpecialName: (v) => !v || /^[a-z0-9]+([a-z0-9_-\s]{2,})+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecialUsername"),

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
      inputRulesIP: (v) => !v || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-4]|2[0-4][0-9]|[1]?[0-9][0-9]?)$/.test(v) || i18n.t("error.validation.ipAddress"),
      inputRulesREALM: (v) => !v || /^[A-Z]{1,15}$/.test(v) || i18n.t("error.validation.realm"),
      inputRulesPORT: (v) => !v || /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(v) || i18n.t("error.validation.ldapURI_PORT"),

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
          case "ge_username": // Generic Username Field
              rules.push(this.inputRulesalphaNumericSpecialUsername)
            break;
          case "ge_password": // Generic Password Field
              rules.push(this.inputRulesalphaNumericPassword)
            break;
          case "ldap_dn": // LDAP Distinguished Name validator
              rules.push(this.inputRulesDN)
            break;
          case "net_ip": // LDAP Realm validator
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
              rules.push(this.inputRulesAlphanumeric, this.inputRulesMax4)
            break;
          case "ge_address_apartment": // Address Apartment
              rules.push(this.inputRulesAlphanumeric, this.inputRulesMax6)
            break;
          case "ge_address_postal_code": // Address Postal Code
              rules.push(this.inputRulesAlphanumeric, this.inputRulesMax8)
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
          case "ge_ascii": // Country
              rules.push(this.inputRulesFullASCIISet)
            break;
          case "dns_root": // Country
              rules.push(this.inputRulesDomainRoot)
            break;

          default:
            break;
        }

        for (var rule in rules) {
        // For every rule in rules array...
          if (rule == this.inputRulesRequired) {
          // If the rule is inputRules Required
            var val = Array.isArray(v) ? v[0] : v;
            message = rules[rule](val);
          } else {
          // Every other rule
            if (Array.isArray(v)) {
            // If an array of values is passed to the input rule - This was necessary to fix undefined / null errors
              v_array = [ ...(v || []) ];
              for (let index = 0; index < v_array.length; index++) {
                if (!v_array[index])
                  v_array[index] = '';
              }
              if ( rules[rule](...v_array) != true && message == true )
                message = rules[rule](...v_array);
            } else { 
            // If a single value is passed to the input rule do the normal thing
              if (!v)
                v = '';
              if ( rules[rule](v) != true && message == true )
                message = rules[rule](v);
            }
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
        else if ("code_ext" in errorData)
          codeToUse = errorData.code_ext
        else if ('code' in errorData)
          codeToUse = errorData.code
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
export default validationMixin;

// Vuelidate Documentation - https://vuelidate.js.org/#sub-regex-based-validator
// Domain validation - https://stackoverflow.com/questions/26093545/how-to-validate-domain-name-using-regex/38578855
// Original Regex: 
// ^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$