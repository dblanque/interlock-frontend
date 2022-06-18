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

const validationMixin ={
    methods:{

      // * ------------------------------ Individual REGEX Input Rules ------------------------------ * //
      inputRulesRequired: (v) => (v != null && v != undefined && v.length != 0) ||  i18n.t("error.validation.fieldRequired"),
      inputRulesAboveZero: (v) => (parseInt(v) > 0) || "Fields must be larger than 0",
      inputRulesLetters: (v) => !v || /^[üöñóúíáéa-zA-Z ]{0,}$/.test(v) || i18n.t("error.validation.alphabetic"),
      inputRulesNumbers: (v) => !v || /^[0-9.]{0,}$/.test(v) || i18n.t("error.validation.numeric"),
      inputRulesMax4: (v) => !v || /^.{1,4}$/.test(v) || i18n.t("error.validation.max4"),
      inputRulesMax6: (v) => !v || /^.{1,6}$/.test(v) || i18n.t("error.validation.max6"),
      inputRulesMax8: (v) => !v || /^.{1,8}$/.test(v) || i18n.t("error.validation.max8"),
      inputRulesAlphanumeric: (v) => !v || /^[üöñóúíáéa-zA-Z0-9]{0,}$/.test(v) || i18n.t("error.validation.alphaNumeric"),
      inputRulesalphaNumericSpaces: (v) => !v || /^[üöñóúíáéa-z0-9]+[üöñóúíáéa-z0-9\s]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpaces"),
      inputRulesalphaNumericSpecial: (v) => !v || /^[üöñóúíáéa-z0-9]+[?¿!@üöñóúíáéa-z0-9,.\s_-]+$/i.test(v) || i18n.t("error.validation.alphaNumericSpecial"),
      inputRulesDomain: (v) => !v || /^((?:http(?:s){0,5}(:\/\/){0,1}){0,1}(?:[a-zA-Z0-9-\\.]){2,61}(?:\.[a-zA-Z]{2,})+)?$/.test(v) || i18n.t("error.validation.domain"),
      inputRulesEmail: (v) => !v || /^([a-zA-Z0-9._-]{2,64})@(?:[a-zA-Z0-9-\\.]){2,61}(?:\.[a-zA-Z]{2,})+$/.test(v) || i18n.t("error.validation.email"),

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
          rules.push(this.inputRulesRequired);
        }

        // ----------------- Centralized rule management for input field types ----------------- //
        // * ------------------------------ Add your rules here ------------------------------ * //
        switch (fieldName) {
          // Generic Field Rules
          case "ge_name": // Generic Name Field
              rules.push(this.inputRulesalphaNumericSpaces)
            break;
          case "ge_message": // Generic Name Field
              rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_topic": // Generic Name Field
              rules.push(this.inputRulesalphaNumericSpecial)
            break;
          case "ge_email": // E-mail
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
          case "ge_country": // Country
              rules.push(this.inputRulesLetters)
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
        'Afghanistan',
        'Albania',
        'Algeria',
        'Andorra',
        'Angola',
        'Antigua & Deps',
        'Argentina',
        'Armenia',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bhutan',
        'Bolivia',
        'Bosnia Herzegovina',
        'Botswana',
        'Brazil',
        'Brunei',
        'Bulgaria',
        'Burkina',
        'Burundi',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Cape Verde',
        'Central African Rep',
        'Chad',
        'Chile',
        'China',
        'Colombia',
        'Comoros',
        'Congo',
        'Costa Rica',
        'Croatia',
        'Cuba',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic',
        'East Timor',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Ethiopia',
        'Fiji',
        'Finland',
        'France',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Greece',
        'Grenada',
        'Guatemala',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Haiti',
        'Honduras',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran',
        'Iraq',
        'Ireland',
        'Israel',
        'Italy',
        'Ivory Coast',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Korea North',
        'Korea South',
        'Kosovo',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Macedonia',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Mauritania',
        'Mauritius',
        'Mexico',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Morocco',
        'Mozambique',
        'Myanmar',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Poland',
        'Portugal',
        'Qatar',
        'Romania',
        'Russian Federation',
        'Rwanda',
        'St Kitts & Nevis',
        'St Lucia',
        'Saint Vincent & the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome & Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'Somalia',
        'South Africa',
        'South Sudan',
        'Spain',
        'Sri Lanka',
        'Sudan',
        'Suriname',
        'Swaziland',
        'Sweden',
        'Switzerland',
        'Syria',
        'Taiwan',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Togo',
        'Tonga',
        'Trinidad & Tobago',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Vatican City',
        'Venezuela',
        'Vietnam',
        'Yemen',
        'Zambia',
        'Zimbabwe'
      ]
      },
      getMessageForCode(code){
        switch(code){
          case null:
          case undefined:
          case "":
          case 'CCONF00':
          case 'CCONF01':
          case 'CCONF99':
          case 'CCONF06':
          case 'USCC01':
          case 'CCONF08':
          case 'CCONF10':
          case 'CU07':
            // Could not get error message to display.
            return i18n.t('error.notDisplayedCorrectly')
          case 'GFP02':
            // We couldn't find a suited Plan for your requirements
            return i18n.t('error.suitedLoanPlanNotFound')
          case 'CUITINVALID':
          case 'CU08':
            // CUIT Verifier Digit is invalid.
            return i18n.t('error.validation.cuitVerifDigit')
          case 'CCONF02': 
          case 'CCONF05': 
          case 'CH01':
          case 'CHS01':
          case 'CHS02':
          case 'CU11':        
          case 'CUC06':  
          case 'LPS01':
            return i18n.t('error.unknown')
          case 'CCONF03':
          case 'CCONF04':
            return i18n.t('verification_code')
          case 'CCONF07':
            return i18n.t('error.codes.auth.verified_successfully')
          case 'CCONF09':
          case 'CCONF11':          
            return i18n.t('error.codes.auth.verification_expired')
          case 'GE00':
            return i18n.t('error.validation.fieldRequired')
          case 'GE01':
          case 'GE02':
          case 'CH02':
          case 'CH03':
          case 'CU09':
          case 'CUS01':
          case 'CUU02':
          case 'CUU03':
          case 'LP01':
          case 'LP02':
          case 'LPS04':
          case 'LPS05':
          case 'LPS06':
          case 'LPS07':
          case 'LPS08':
          case 'LPS09':
          case 'LPS10':
          case 'LPS11':
          case 'LOS01':
          case 'LOS02':
          case 'LOS03':
            return i18n.t('error.validation.fieldinvalid')
          case 'CH04': 
          case 'CH07':
            return i18n.t('error.codes.charges.CH04')
          case 'CH05':
          case 'CH06':
          case 'CH08': 
            return i18n.t('error.codes.charges.'+code)
          case 'CU01':
          case 'CU02':
          case 'CU03':
          case 'CU04':
          case 'CU05':
          case 'CU06':
          case 'CU10':
          case 'CUC01':
          case 'CUC02':
          case 'CUC03':
          case 'CUC04':
          case 'CUC05':
          case 'CUU01':
            return i18n.t('error.codes.customer.'+code)
          case 'CU12':
          case 'CU13':
            return i18n.t('error.codes.customer.USCC01')
          case 'GFP01': return i18n.t('error.codes.customer.CUU01')
          case 'INRP01':
            return i18n.t('error.codes.installment.'+code)
          case 'LPD01':
          case 'LPD02':
          case 'LPD03':
          case 'LPD04':
          case 'LPD99':
          case 'LPS02':
          case 'LPS03':
            return i18n.t('error.codes.loanPlan.'+code)
          case 'LO00':
          case 'LO01':
          case 'LO02':
          case 'LO03':
          case 'LO04':
          case 'LO05':
          case 'LOC01':
          case 'LOI01':
          case 'LOUS01':
          case 'LOUS02':
          case 'LOUS03':
          case 'LOUS04':
          case 'LOUS05':
          case 'LOUS06':
          case 'LOUS07':
          case 'USC01':
          case 'USC02':
          case 'USCAD01':
          case 'USCAD02':
          case 'USCAN01':
          case 'USCM01':
          default:
            return code;
        }
      }
    },
  }
export default validationMixin;

// Vuelidate Documentation - https://vuelidate.js.org/#sub-regex-based-validator
// Domain validation - https://stackoverflow.com/questions/26093545/how-to-validate-domain-name-using-regex/38578855
// Original Regex: 
// ^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$