const config = {
	general: {
		row1: {
			ILCK_ENABLE_LDAP: {
				value: false,
				type: "boolean",
			},
		}
	},
	log: {
		row1: {
			// Log parameters
			ILCK_LOG_MAX: {
				value: 0,
				validator: 'set_log_max',
				type: "integer",
				extraClasses: "mb-4"
			},
			ILCK_LOG_CREATE: {
				value: true,
				type: "boolean",
			},
			ILCK_LOG_READ: {
				value: false,
				type: "boolean",
			},
			ILCK_LOG_UPDATE: {
				value: true,
				type: "boolean",
			},
			ILCK_LOG_DELETE: {
				value: true,
				type: "boolean",
			},
			ILCK_LOG_OPEN_LDAP_CONNECTION: {
				value: false,
				type: "boolean",
			},
			ILCK_LOG_CLOSE_LDAP_CONNECTION: {
				value: false,
				type: "boolean",
			},
			ILCK_LOG_LOGIN: {
				value: false,
				type: "boolean",
			},
			ILCK_LOG_LOGOUT: {
				value: false,
				type: "boolean",
			},
		}
	},
}

export default config