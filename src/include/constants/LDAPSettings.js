const config = {
	domain: {
		row1: {
			// Domain Parameters
			LDAP_AUTH_URL: {
				value: [],
				addPREFIX: "ldap://",
				addIP: "",
				addPORT: "",
				type: "ldap_uri",
				required: true,
				validator: "ldap_uri"
			}
		},
		row2: {
			LDAP_DOMAIN: {
				value: "",
				hint: 'section.settings.fields.LDAP_DOMAIN_HINT',
				validator: 'ldap_website',
				required: true
			},
			LDAP_AUTH_SEARCH_BASE: {
				value: "",
				hint: 'section.settings.fields.LDAP_AUTH_SEARCH_BASE_HINT',
				validator: 'ldap_dn',
				required: true
			},
			LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN: {
				value: "",
				hint: 'section.settings.fields.LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN_HINT',
				validator: "ldap_realm",
				required: true
			},
			LDAP_DNS_LEGACY: {
				value: false,
				type: "boolean",
				hint: 'section.settings.fields.LDAP_DNS_LEGACY_HINT',
				persistentHint: true
			},
		}
	},
	bindUser: {
		row1: {
			// Bind User
			LDAP_AUTH_CONNECTION_USER_DN: {
				value: "",
				validator: "ldap_dn"
			},
			LDAP_AUTH_CONNECTION_PASSWORD: {
				value: "",
				type: "password",
				hidden: true,
				required: 'config.ldap.bindUser.row1.LDAP_AUTH_CONNECTION_USER_DN'
			}
		}
	},
	connection: {
		row1: {
			// Connection Parameters
			LDAP_AUTH_CONNECT_TIMEOUT: {
				value: 5,
				type: "integer",
				validator: "ge_numbers"
			},
			LDAP_AUTH_RECEIVE_TIMEOUT: {
				value: 5,
				type: "integer",
				validator: "ge_numbers"
			},
			LDAP_AUTH_USE_SSL: {
				value: false,
				type: "boolean",
				extraClasses: "mb-2",
				hint: "section.settings.fields.LDAP_USE_SSL_HINT",
				persistentHint: true
			},
		},
		row2: {
			LDAP_AUTH_USE_TLS: {
				value: false,
				type: "boolean",
				hint: "section.settings.fields.LDAP_USE_SSL_HINT",
				persistentHint: true
			},
			LDAP_AUTH_TLS_VERSION: {
				value: "PROTOCOL_TLSv1_2",
				choices: [
					"PROTOCOL_TLSv1",
					"PROTOCOL_TLSv1_1",
					"PROTOCOL_TLSv1_2",
					"PROTOCOL_TLS",
					"PROTOCOL_TLS_CLIENT"
				],
				hint: 'section.settings.fields.LDAP_AUTH_TLS_VERSION_HINT',
				persistentHint: true,
				type: "select"
			}
		}
	},
	filters: {
		row1: {
			ADMIN_GROUP_TO_SEARCH: {
				value: "",
			},
			LDAP_AUTH_OBJECT_CLASS: {
				value: "",
			}
		},
		row2: {
			EXCLUDE_COMPUTER_ACCOUNTS: {
				value: false,
				type: "boolean"
			}
		},
		row3: {
			LDAP_FIELD_MAP: {
				value: {},
				keyToAdd: "",
				valueToAdd: "",
				type: "object",
				allow_add_delete: false
			},
		}
	}
}

export default config