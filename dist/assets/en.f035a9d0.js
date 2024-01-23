const e="Interlock - LDAP Manager",o={home:"Home",users:"Users",groups:"Security Groups",dns:"DNS",gpo:"GPO",dns_short:"DNS",gpo_short:"GPO",server:"Server",settings:"Settings",logs:"Event Logs",header:{home:"Full Directory Tree",users:"Users",groups:"Security Groups",dns:"Domain Name Server",gpo:"Group Policy Objects",server:"Server Management",settings:"Settings",logs:"Event Logs"}},r={ldap:{manual_command:"Manual LDAP Command",operation:"LDAP Operation",operation_list:{ADD:"Add",DELETE:"Delete",MODIFY:"Modify",MODIFYDN:"Modify-dn",SEARCH:"Search",COMPARE:"Compare",EXTENDED:"Extended"},filter:"LDAP Filter"},expirePwd:"Expire Password",extra:"Extra",moreActions:"More Actions",refreshToken:"Refresh Access Token",import:"Import",export:"Export",groupBy:"Group by",filter:"Filter",rename:"Rename",openAll:"Open all",closeAll:"Close all",unlock:"Unlock",resetFilters:"Reset Filters",backToLogin:"Go back to Log-in",testSettings:"Test Settings",restoreDefaultValues:"Restore Default Values",areYouSure:"Are you sure you wish to",label:"Actions",revert:"Revert",done:"Done",enable:"Enable",disable:"Disable",clickTo:"Click to",move:"Move",changePassword:"Change Password",changeEnduserPassword:"Change your Password",goToLink:"Go to Link",goTo:"Go to",search:"Search",yes:"Yes",no:"No",apply:"Apply",addF:"New",addM:"New",addN:"Add",previous:"Previous",back:"Go Back",back_short:"Back",confirm:"Confirm",edit:"Edit",view:"View",delete:"Delete",remove:"Remove",reset:"Reset",isRequired:"is required",isNotValid:"must be valid",Select:"Select",submit:"Submit",create:"Create",save:"Save",saveClose:"Save & Close",close:"Close",next:"Next",cancel:"Cancel",click:"Click",block:"Block",unblock:"Unblock",verify:"Verify",unverify:"Unverify",language:"Language",expires:"Expires",approve:"Approve",reject:"Reject",refresh:"Refresh",loading:"Loading",loading_long:"Loading, please wait",download:"Download",downloadLatest:"Download Latest",changeUserPerms:"View Permissions",massChangeUserPerms:"Change Permissions",changeUserGroups:"View Groups",addObjectClass:"Add Object Class",passwordChanged:"Password Changed"},t={created:{single:{m:"Created",f:"Created",n:"Created"},plural:{m:"Created",f:"Created",n:"Created"}},updated:{single:{m:"Updated",f:"Updated",n:"Updated"},plural:{m:"Updated",f:"Updated",n:"Updated"}},deleted:{single:{m:"Deleted",f:"Deleted",n:"Deleted"},plural:{m:"Deleted",f:"Deleted",n:"Deleted"}},saved:{single:{m:"Saved",f:"Saved",n:"Saved"},plural:{m:"Saved",f:"Saved",n:"Saved"}},all:{single:{m:"All",f:"All",n:"All"},plural:{m:"All",f:"All",n:"All"}},none:{single:{m:"None",f:"None",n:"None"}},success:"Success",skipped:"Skipped",status:"Status",selected:"Selected",readOnly:"Read Only",member:"Member",enabled:"Enabled",disabled:"Disabled",seconds:"Seconds",minutes:"Minutes",hours:"Hours",key:"Key",value:"Value",error:"Error",today:"Today",filter:"Filter",legend:"Legend",export:"Export",maximum:"Maximum",minimum:"Minimum",expiration:"Expiration",expiration_ab:"Exp.",at:"At",of:"Of",details:"Details",list:"List",to:"To",currently:"Currently",notes:"Notes",secondaryM:"Secondary",secondaryF:"Secondary",others:"Others",processing:"Processing",date:"Date",loaded:{single:{m:"Loaded",f:"Loaded",n:"Loaded"},plural:{m:"Loaded",f:"Loaded",n:"Loaded"}},unlocked:{single:{m:"Unlocked",f:"Unlocked",n:"Unlocked"},plural:{m:"Unlocked",f:"Unlocked",n:"Unlocked"}}},s={log:{single:"Log",plural:"Logs"},connection:{single:"Connection",plural:"Connections"},user:{single:"User",plural:"Users"},contact:{single:"Contact",plural:"Contacts"},"builtin-domain":{single:"Built-in",plural:"Built-ins"},container:{single:"Container",plural:"Containers"},person:{single:"Person",plural:"Persons"},group:{single:"Group",plural:"Groups"},computer:{single:"Computer",plural:"Computers"},printer:{single:"Printer",plural:"Printers"},"organizational-unit":{single:"Organizational Unit",plural:"Organizational Units"},ou:{single:"Organizational Unit",plural:"Organizational Units"},setting:{single:"Setting",plural:"Settings"},ldap:{single:"LDAP Object",plural:"LDAP Objects"},dns:{zone:{single:"DNS Zone",plural:"DNS Zones"},record:{single:"DNS Record",plural:"DNS Records"}}},a={codes:{conflict:"HTTP 409: Conflict",badRequest:"HTTP 405: Bad Request",serverError:"HTTP 500: Server Error",ldapGwError:"LDAP Server is Unreachable",invalidCSV:"Invalid CSV File",invalidCSVHeaders:"Invalid CSV Headers",fileReader:"File Reader Exception",networkError:"AXIOS: Network Error",auth:{invalid_credentials:"Incorrect Email or Password",verification_code:"Incorrect Code, Please try again",verified_successfully:"Verified Successfully",verification_expired:"Verification codes have been exhausted, contact an admin"},otp:{otp_invalid_code:"OTP Code is invalid",otp_invalid_recovery_code:"Recovery Code is invalid",otp_invalid_data:"OTP Data is invalid",otp_required:"OTP Code is Required",otp_no_device_registered:"No OTP Device Registered"},dns:{dns_zone_missing:"Zone Value is invalid",dns_zone_in_record:"Zone must not be included in Record Name",dns_zone_not_deletable:"Zone cannot be deleted",dns_zone_exists:"Zone already exists",dns_zone_does_not_exist:"Zone does not exist",dns_record_not_in_request:"Record is not present in request",dns_record_dn_missing:"Record does not contain the requested Distinguished Name",dns_record_type_conflict:"Record Type Insertion or Update has a conflict",dns_record_exists_conflict:"Record already exists",dns_record_type_unsupported:"Record Type not supported",dns_record_attr_missing:"Record does not contain a required attribute",dns_record_type_missing:"Record Type not in Request",dns_record_data_does_not_match:"Record Data does not match server-side entry",dns_record_entry_does_not_exist:"Record LDAP Entry does not exist",dns_record_data_malformed:"DNS Record is Malformed",dns_record_serial:"Unable to set Record Serial",dns_soa_fetch:"Could not fetch Record Zone SOA",dns_soa_serial_increment:"Unable to increment SOA Serial",dns_soa_record_root_only:"A Start Of Authority Record can only be set for the root of your zone",dns_root_servers_only_cli:"Root DNS Servers may only be modified by command-line",dns_field_validator_failed:"A Field in the Record has failed validation",dns_list_response_empty:"LDAP Response does not contain the DNS List",dns_field_validator_exception:"Unhandled DNS Field Validator Exception",dns_record_create:"Record could not be created"},users:{noUsersInImport:"No Users detected in File",user_permission_malformed:"User permissions in request are malformed",user_passwords_dont_match:"User passwords do not match",user_create_error:"User could not be created",user_bulk_create_error:"A user could not be created",user_bulk_mapping_error:"A required header mapping is invalid or missing",user_bulk_length_error:"A row does not have the correct field amount or delimitation",user_update_error:"User could not be updated",user_field_validator_error:"User could not be validated",user_dn_does_not_exist:"User Distinguished Name does not exist",user_dn_path_exception:"User DN Path Parsing Stage Exception",user_anti_lockout:"User Anti-lockout Exception",user_unlock_error:"User could not be unlocked",user_country_error:"User country could not be updated",user_group_fetch_error:"User Group Memberships could not be fetched",user_group_primary_err:"Primary Group for User cannot be Deleted",user_group_bad:"Bad User Group Member Operations"},ldap:{ldap_obj_exists:"An object with this Common Name already exists",ldap_connection_not_open:"No LDAP Connection was open prior to this operation",ldap_perm_insufficient:"Insufficient LDAP Permissions",ldap_obj_doesnt_exist:"An object with this Distinguished Name does not exist",ldap_bind_err:"Could not bind to LDAP Server",ldap_tree_err:"Could not fetch Directory Tree from LDAP Server",ldap_port_err:"LDAP Server Port unreachable",ldap_bind_test_failed:"Bind Connection Failed"},groups:{group_does_not_exist:"Specified Group does not exist",group_create:"Group could not be Created",group_delete:"Group could not be Deleted",group_update:"Group could not be Updated",group_member_add:"Members could not be added to Group",group_member_remove:"Members could not be removed from Group",group_scope_or_type:"Group Scope or Type missing from Request",group_dn_missing:"Group Distinguished Name missing from Request",group_builtin_protect:"Specified Group cannot be Deleted as it is builtin",group_members_bad:"The same members are in the Add Member and Remove Member lists"},ldapObjectExists:"An LDAP Object with that Identifier Exists",namingViolation:"Naming Violation Exception",unwillingToPerform:"LDAP Server is Unwilling to Perform Action",unwillingToPerformPwd:"Active Directory requires LDAPS to modify passwords"},settings:{testInvalid:"LDAP Bind Connection Failed",serverUnreachable:"LDAP Server Unreachable"},data:{noCountryCode:"No country code set"},validation:{int32:"Must be a 32-bit Integer",below10000:"Numeric value must be below 10000",aboveZero:"Numeric value must be above 0",doubleQuotes:"Double quotes are not allowed",singleQuotes:"Single quotes are not allowed",domainRoot:"Must be a valid Domain Name (Exclude the DNS Zone, @ allowed for root)",ascii:"String Data must contain only ASCII Characters",fieldinvalid:"One or more fields are invalid",fieldRequired:"This field is required",passwordNotSame:"Passwords must match",alphabetic:"Must contain only letters (2 character minimum)",numeric:"Must contain only numbers",max4:"4 Characters Maximum",max6:"6 Characters Maximum",max8:"8 Characters Maximum",max255:"255 Characters Maximum",alphaNumeric:"Must be Alphanumeric",alphaNumericSpecialUsername:"Must contain only letters (hyphen allowed)",alphaNumericPassword:"8 char. minimum, special characters allowed: !@#$%&*()",alphaNumericSpaces:"a-z A-Z 0-9 and Spaces, 2 char. min",alphaNumericSpecial:"a-z A-Z 0-9 -_ and Spaces, 2 char. min",domain:"Must be a valid Top-Level Domain ( example.tld | domain.com )",email:"Must be a valid E-Mail (E.g.: john@domain.com)",phone:"Must be a valid Phone",date:"Date is invalid",dayDate:"Day Date is invalid",ipv4Address:"Invalid IPv4 Address",ipv6Address:"Invalid IPv6 Address [0-9a-fA-F]",ipv6AddressUri:"IPv6 URI must be enclosed by brackets",ipv6AddressLength:"Invalid IPv6 Address Length",ipv6AddressAmbiguous:"Ambiguous IPv6 Address",distinguishedName:"Distinguished Name is invalid",realm:"NT Realm is invalid",domainCanonical:"Must be a valid Domain in Canonical format (with a dot at the end)",totpLength:"TOTP Code must be 6 digits long"},unableToLoad:"Unable to load",notDisplayedCorrectly:"Could not get error message to display",notFound:"not found",unknown_short:"An Unknown error has occurred",unknown:"An Unknown error has occurred, please try again or contact us"},n={hints:{name:"Use the character @ to identify your root zone",serial_create:"Leave empty to auto-generate the serial",serial_edit:"If this is not modified the serial will be auto-incremented",stringData:"Insert the record without double quotation marks",quotesNotRequired:"Double quotes are not required, they are automatically set by the system"},attributes:{index:"Record Index",infiniteTtl:"Infinite TTL",ttl:"Time To Live",value:"Record Value",displayName:"Display Name",name:"Record Name",nameNode:"Node Name",nameTarget:"Target Name",ipv4Address:"IPv4 Address",ipv6Address:"IPv6 Address",address:"Address",type:"Record Type (Internal)",typeName:"Record Type",serial:"Serial",ts:"Tombstoned",tstime:"Tombstone Time",wPriority:"Priority",wWeight:"Weight",wPort:"Port",dwSerialNo:"Serial No.",dwRefresh:"Refresh",dwRetry:"Retry",dwExpire:"Expire",dwMinimumTtl:"Minimum TTL",namePrimaryServer:"Name Primary Server",zoneAdminEmail:"Zone Admin E-mail",nameExchange:"Name Exchange",stringData:"String Data",wPreference:"Priority"}},i={attributes:{realm:"NT Realm",domain:"Domain",name:"Name",objectRid:"Object Relative Identifier (RID)",objectSid:"Object Security Identifier (SID)",hasMembers:"Populated",sAMAccountName:"Account Name",username:"Username",givenName:"First Name",sn:"Last Name",cn:"Common Name",groupType:"Group Type",password:"Password",passwordConfirm:"Confirm Password",initials:"Initials",mail:"Email",displayName:"Full Display Name",is_enabled:"Account is Enabled",is_disabled:"Account is Disabled",last_login:"Last Login",role:"Role",is_staff:"Is Staff",telephoneNumber:"Phone Number",streetAddress:"Street Address",postalCode:"Postal Code",l:"City",st:"State / Province",countryCode:"Country INT Code",countryCodeCombined:"Country INT / ISO",c:"Country ISO Code",co:"Country",wWWHomePage:"Web Page",distinguishedName:"Distinguished Name",userPrincipalName:"User Principal Name",userPrincipalName_pre2000:"User Logon Name (pre-Windows 2000)",userAccountControl:"User Permissions (Raw INT)",whenCreated:"Account created at",whenChanged:"Account modified at",lastLogon:"Last Logon",badPwdCount:"Bad Password Count",pwdLastSet:"Password Last Set at",primaryGroupID:"Primary Group ID",objectClass:"Object Class",objectCategory:"Object Category",sAMAccountType:"Account Type"}},d={objectEditor:"Object Editor"},l={dns:{zoneToAddName:"Name of the new DNS Zone",confirmZoneCreation:"Confirm Zone Creation",legacyMode:"Using Legacy DNS Mode",legacyMode_hint:"Have you tried Legacy DNS Mode?",createSuccess:"Record Created",updateSuccess:"Record Updated",deleteSuccess:"Record Deleted",deleteRecord:{message:"Are you sure you wish to delete the DNS Record"},massAction:{delete:"The following DNS Records will be deleted"},deleteZone:{message:"Are you sure you wish to delete the DNS Zone",confirmZone:"Please confirm by writing the Zone name again"}},login:{title:"Log in to your LDAP Server",account:"LDAP Account / Username",useEmail:"Use E-Mail",useLDAPUser:"Use LDAP Account",loginBtn:"Log-in",useRecoveryCode:"Use Recovery Code",forgotMyPassword:"I forgot my password",tooManyLogins:"You've been timed out",tryAgain:"You may now try again",oneRetryLeft:"retry left",retriesLeft:"retries left"},logs:{resetDialog:{header:"Delete Event Logs",message:"Are you sure you wish to delete <b>all</b> the stored event logs?"},truncateDialog:{header:"Truncate Event Logs",message:"Are you sure you wish to truncate the stored event logs?"},extras:{move:"LDAP Object was moved",rename:"LDAP Object was renamed",end_user_updated:"User changed his details",changed_password:"User password changed",disable:"User was disabled",enable:"User was enabled",unlock:"User was unlocked"},headers:{date:"Log Date",user:"Responsible User",affectedObject:"Affected Object(s)",actionType:"Action Type",objectClass:"Object Class",extraMessage:"Extra Details",id:"Log ID"},prevValue:"Previous Value",newValue:"New Value",seeDetails:"See Details",viewAction:{truncate:{slider:"Range to Truncate",button:"Truncate Logs",max:"Max",min:"Min"}},actionType:{CREATE:"Create",READ:"Read",UPDATE:"Update",DELETE:"Delete",LOGIN:"Login",LOGOUT:"Logout",OPEN:"Opened LDAP Connection",CLOSE:"Closed LDAP Connection"}},enduser:{title:"Welcome",helpMessage:"Below you can modify your Active Directory / LDAP user details and password"},dirtree:{deleteObject:{title:"Delete LDAP Object",message:"Are you sure you wish to delete"},ouCreate:{header:"Create Organizational Unit",step1:"Organizational Unit Details",step2:"Organizational Unit Created",step2_success:"Organizational Unit Created Successfully",ouCreatedIn:"Organizational Unit will be created in"},computerCreate:{step1:"Computer Details",step2:"Computer Created",step2_success:"Computer Created Successfully",computerCreatedIn:"Computer will be created in"},printerCreate:{step1:"Printer Details",step2:"Printer Created",step2_success:"Printer Created Successfully",printerCreatedIn:"Printer will be created in"},filterHint:"Click the blue chips to filter them",rename:{title:"Rename LDAP Object",originalDistinguishedName:"Original Distinguished Name",success:"LDAP Object renamed successfully"},move:{setToRoot:"Select Domain Root",title:"Move LDAP Object",willBeMovedTo:"Will be moved to",originalRelativePath:"Original Relative Path",success:"LDAP Object moved successfully"}},users:{userCreate:{header:"Create User",optionalsHeader:"Optional Details",domainRealmError:"Domain Settings Error, please re-open this component",userCreatedIn:"User will be created in",step1:"User Details",step2:"Password and Permissions",step3:"User Created",step3_success:"User Created Successfully"},resetPasswordDialog:{title:"Reset Password",changePasswordForUser:"Changing password for user",complexity:{title:"Password Complexity Recommendations",letters:"Upper or lowercase letters (A-Z / a-z)",numbers:"Numeric characters (0\u20139)",symbols:"Non-alphanumeric characters like $, # or %",dontMatchUser:"No more than two symbols from the user's account name or display name"}},userDialog:{noLastLogon:"User has not logged in yet",userDetails:"User Details",addToGroup:"Add to Group",removeFromGroup:"Remove from Group",primaryGroupRemoveDisabled:"The primary group cannot be removed",containsGroups:"Contains Groups",doesNotContainGroups:"Does not contain Groups",hint:{addObjectClass:"You better know what you're doing",primaryGroupID:"Only change this if you have Macintosh Clients or POSIX Compliant Applications"}},import:{title:"User Bulk Import",fileToUpload:"Attach User List File",supportedExtensions:"<b>.csv</b>, <b>.tsv</b>, or <b>.txt</b> file separated by <b>commas</b> or <b>tabs</b><br> do not delete the headers",fileReady:"File ready to import",fileCleared:"File Cleared",importOptions:"Import Options",usePlaceholderPassword:"Use Placeholder Password",dataMapping:"User Field Mapping",editUserMappings:"Edit Field Mappings",uploadFile:"Upload File",previewData:"Preview Data",previewMode:"User Bulk Import Preview",readyToImport:"File Ready to Import",downloadTemplate:"Download Template CSV",bulkImportSuccess:"Users Imported Successfully",bulkImportPartial:"Users Imported with Errors",error:{validation:"Field Validation Error",permission:"Permission Parsing Error",country:"Country Parsing Error, see ISO-3166",create:"Could not create User Object",password:"Could not modify LDAP Password"}},export:{title:"User Bulk Export"},youAreHere:"You are here",userUnlocked:"User unlocked Successfully",errorUserUnlock:"Error unlocking User",tryingToDisable:"You're trying to disable",disablingOwnUser:"You cannot disable your own user",antiLockoutWarning:"Anti-lockout Warning",basicDetails:"Basic Details",location:"Location",editFlagWarning:"You are now editing this user",viewFlagWarning:"You are viewing this user",perms:"User Permissions",groups:"User Groups",permsRaw:"Raw Output",permsRawHint:"Click here to open Microsoft Documentation on LDAP Permissions",permsCalc:"Calculated Permissions Int. Number",permsOutputArray:"Array/List to send",advancedDetails:"Advanced Details",deleteUser:{title:"Delete User",message:"Are you sure you wish to delete the user",mass:"Are you sure you wish to mass delete the selected users",success:"Delete Operation Complete"},permissions:{LDAP_UF_SCRIPT:"Script Account",LDAP_UF_ACCOUNT_DISABLE:"Disable User Account",LDAP_UF_HOMEDIR_REQUIRED:"Home Directory Required",LDAP_UF_LOCKOUT:"Account Locked Out",LDAP_UF_PASSWD_NOTREQD:"User does not require Password",LDAP_UF_PASSWD_CANT_CHANGE:"User cannot change Password",LDAP_UF_ENCRYPTED_TEXT_PASSWORD_ALLOWED:"Encrypted text in password allowed",LDAP_UF_NORMAL_ACCOUNT:"Normal Account",LDAP_UF_INTERDOMAIN_TRUST_ACCOUNT:"Trust Inter-domain Account",LDAP_UF_WORKSTATION_TRUST_ACCOUNT:"Trust Work-station Account",LDAP_UF_SERVER_TRUST_ACCOUNT:"Trust Server Account",LDAP_UF_DONT_EXPIRE_PASSWD:"Password does not expire",LDAP_UF_MNS_LOGON_ACCOUNT:"MNS Logon Account",LDAP_UF_SMARTCARD_REQUIRED:"Requires Smart-Card",LDAP_UF_TRUSTED_FOR_DELEGATION:"Trusted for Delegation",LDAP_UF_NOT_DELEGATED:"Account is not Delegated",LDAP_UF_USE_DES_KEY_ONLY:"Use DES Key Only",LDAP_UF_DONT_REQUIRE_PREAUTH:"Do not require Pre-Authentication",LDAP_UF_PASSWORD_EXPIRED:"Password is Expired",LDAP_UF_TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION:"Trusted to Authenticate for Delegation",LDAP_UF_NO_AUTH_DATA_REQUIRED:"No Authentication Data Required",LDAP_UF_PARTIAL_SECRETS_ACCOUNT:"Partial Secrets Account"}},groups:{groupBuiltinCannotDelete:"This group is built-in or protected",editFlagWarning:"You are now editing this group",isPopulated:"This group is populated",isNotPopulated:"This group is not Populated",types:{GROUP_DISTRIBUTION:"Distribution Group",GROUP_SYSTEM:"System Created",GROUP_GLOBAL:"Global Scope",GROUP_DOMAIN_LOCAL:"Domain Local Scope",GROUP_UNIVERSAL:"Universal Scope",GROUP_SECURITY:"Security Group"},groupCreate:{header:"Create Group",step1:"Group Details",step2:"Group Members",step3:"Group Created",step3_success:"Group Created Successfully",optionalsHeader:"Optional Details",groupCreatedIn:"Group will be created in",memberAddError:"Error adding member, please try again"},groupDialog:{groupType:"Group Type",groupScope:"Group Scope",members:"Group Members",copyDistinguishedName:"Copy Distinguished Name"},deleteGroup:{title:"Delete Group",message:"Are you sure you wish to delete the group"}},settings:{waitingServiceRestart:"Waiting for Service Restart",defaultAdminIs:"Default Admin is",resetDialog:{header:"Reset Settings",message:"Are you sure you wish to reset <b>all</b> the settings?"},testSuccess:"LDAP Connection Successful",settingFailedValidation:"A parameter has failed validation",headers:{log:"Logging",domain:"Domain",bindUser:"Bind User",connection:"Connection",filters:"Filters"},fields:{LDAP_LOG_MAX:"Maximum Logs in Rotation",LDAP_LOG_READ:"Log READ Events",LDAP_LOG_CREATE:"Log CREATE Events",LDAP_LOG_UPDATE:"Log UPDATE Events",LDAP_LOG_DELETE:"Log DELETE Events",LDAP_LOG_OPEN_CONNECTION:"Log OPEN LDAP CONNECTION Events (Not recommended)",LDAP_LOG_CLOSE_CONNECTION:"Log CLOSE LDAP CONNECTION Events (Not recommended)",LDAP_LOG_LOGIN:"Log Interlock LOGIN Events",LDAP_LOG_LOGOUT:"Log Interlock LOGOUT Events",LDAP_URI_PREFIX:"LDAP Prefix",LDAP_URI_IP:"Server IP",LDAP_URI_PORT:"Server Port",LDAP_URI_PORT_HINT:"Valid range: 1-65535",LDAP_AUTH_URL:"LDAP Servers",LDAP_AUTH_URL_HINT:"Add a server to the list",LDAP_DOMAIN:"LDAP Domain",LDAP_DOMAIN_HINT:"Example: domain.com",LDAP_PORT:"LDAP Server Port",LDAP_PORT_HINT:"Defaults: 389 (Non-TLS), 636 (TLS)",LDAP_DNS_LEGACY:"Legacy DNS",LDAP_DNS_LEGACY_HINT:"Test this if your DNS Section is not working",LDAP_AUTH_SEARCH_BASE:"LDAP/AD Search Base",LDAP_AUTH_SEARCH_BASE_HINT:"Example: dc=domain,dc=com",LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN:"Active Directory Domain / Realm",LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN_HINT:"Example: DOMAIN",LDAP_AUTH_CONNECTION_USER_DN:"Bind User DN",LDAP_AUTH_CONNECTION_PASSWORD:"Bind User Password",LDAP_AUTH_CONNECT_TIMEOUT:"LDAP Auth Connect Timeout",LDAP_AUTH_RECEIVE_TIMEOUT:"LDAP Auth Receive Timeout",LDAP_AUTH_USE_SSL:"Use SSL",LDAP_USE_SSL_HINT:"Requires the ldaps:// prefix",LDAP_AUTH_USE_SASL:"Use SASL (GSSAPI)",LDAP_AUTH_USE_TLS:"Use TLS",LDAP_AUTH_TLS_VERSION:"TLS Version",LDAP_AUTH_TLS_VERSION_HINT:"Default is PROTOCOL_TLSv1_2",ADMIN_GROUP_TO_SEARCH:"Admin Group DN Filter",LDAP_AUTH_OBJECT_CLASS:"Authentication Object Class",EXCLUDE_COMPUTER_ACCOUNTS:"Exclude Computer Accounts",LDAP_AUTH_USER_FIELDS:"LDAP Field Mapping",LDAP_AUTH_USER_LOOKUP_FIELDS:"Authentication User Lookup Fields"}}},c={fname:"First Name",lname:"Last Name",name:"Name",fullName:"Full Name",email:"E-Mail",country:"Country",type:"Type",optional:"Optional",sexes:{female:"Female",male:"Male",other:"Other",unspecified:"Unspecified"},users:{password:"Password",passwordConfirm:"Confirm Password",role:"Role",totp_code:"TOTP Code",totp_code_opt:"Required if Enabled on Account Preferences",recovery_code:"Recovery Code"},phone:"Phone",phoneNumber:"Phone Number",secondaryPhone:"Secondary Phone",address:"Address",addressStreet:"Street",addressNumber:"Street Number",betweenStreets:"Between Streets",addressVerified:"Verified Address",addressCity:"City",addressPostalCode:"Postal Code",addressFloor:"Floor",addressApartment:"Apartment",addressState:"State",role:"Role",featureWIP:"This feature being worked on",notEnoughPerms:"Insufficient permissions",featureNotAvailable:"This feature is not available"},u={copyright:"Copyright (C) 2022 | BR Consulting S.R.L.",about:"About",donate:"Donate"},p={title:"Account",title_long:"Account Preferences",logout:"Logout",changePreferences:"Change Preferences",two_factor_title:"Two-Factor Authentication",enable_two_factor:"Enable TOTP 2FA",showQR:"Show TOTP QR Code",hideQR:"Hide QR Code",validateTOTP:"Validate TOTP QR Code",TOTPnotConfirmed:"Please Confirm your TOTP 2FA",recoveryCodes:"Consumable Recovery Codes",totpCodeFieldLabel:"6-digit TOTP Code",totpCreated:"TOTP Code Created",totpDeleted:"TOTP Code Deleted",totpValidated:"TOTP Code Validated",qrIsEnabled:"TOTP 2FA is enabled",qrInfo:"Scan this QR Code with a TOTP Authenticator App"},m={version:"Version",clickToRefreshBackendStatus:"Click to refresh the Interlock Back-end Status",autocomputedField:"Autocomputed Field",darkMode:"Enable Dark Mode",logoutMsg:"Are you sure you wish to Logout?",loggedOut:"Logout Successful",logoutForbiddenMsg:"Please Log in Again",changePreferences:"Change Preferences",themerTooltip:"Change Theme",tokenRefreshed:"Access Token Refreshed",actionRequired:"Action Required",refreshTokenTimer:"Refresh Token will expire in"},_={title:"About Interlock",subTitle:"Other Contributors",mainMsg:'Interlock was originally developed by <a target="_blank" href="https://dylan.blanque.com.ar">Dylan Blanqu\xE9</a> as an internal tool for <b>BR Consulting S.R.L.</b> and later made open source, with the intent of sharing a responsive and dynamic LDAP Management tool with the community.',jblanque:"Credited for assistance with Samba Binary Permission Parsing",mvilche:{1:"Credited for Calls Module and Constructors in Interlock Front-end",2:"Credited for Notification Bus: Assistance with Implementation",3:"Other Minor Fixes and Assistance"},etianen:"Credited for creating the original Django-python3-ldap module",dirkjanm:"Credited for his <b>amazing</b> krbrelayx repo and scripts"};var A={indexTitle:e,category:o,actions:r,words:t,classes:s,error:a,dns:n,ldap:i,components:d,section:l,attribute:c,footer:u,userAccountDropdown:p,misc:m,contrib:_};export{r as actions,c as attribute,o as category,s as classes,d as components,_ as contrib,A as default,n as dns,a as error,u as footer,e as indexTitle,i as ldap,m as misc,l as section,p as userAccountDropdown,t as words};
