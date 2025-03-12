const LDAPUserClasses = ['user', 'person', 'organizationalPerson', 'organizationalperson']
const LDAPUserCategories = {
	basic: [
		"sAMAccountName",
		"givenName",
		"sn",
		"mail",
		"displayName",
		"is_enabled",
		"last_login",
		"telephoneNumber",
		"wWWHomePage",
	],
	location: [
		"streetAddress",
		"postalCode",
		"l",
		"st",
		"countryCode",
		"co",
		"c",
	],
	account: [
		"distinguishedName",
		"userPrincipalName",
		"userAccountControl",
		"whenCreated",
		"whenChanged",
		"lastLogon",
		"badPwdCount",
		"pwdLastSet",
		"primaryGroupID",
		"objectClass",
		"objectCategory",
		"sAMAccountType"
	]
}

export {
	LDAPUserClasses,
	LDAPUserCategories
}