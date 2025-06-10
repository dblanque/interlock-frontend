import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'
import { dateLdapToString, dateFromFiletime } from '@/include/utils.js'

class User extends ApiModel {

	first_name;
	last_name;
	username;
	password;
	last_login;
	role;
	is_staff;
	full_name;
	email;
	phone;
	street_address;
	postal_code;
	// Locale / City
	city;
	// State/Province
	state_province;
	// INT
	country_code_dcc;
	// 2 Letter Code for Country
	country_code_iso;
	// Full Country Name
	country_name;
	website;
	distinguished_name;
	user_principal_name;
	groups;
	// Permission ACLs
	user_account_control;
	created_at;
	changed_at;
	last_login;
	bad_password_count;
	password_set_at;
	primary_group_id;
	object_class;
	object_category;
	account_type;
	permissions;

	/**
	 * Fetches model instance from API by id.
	 * @param {Number} id 
	 */
	constructor(data) {
		super(data)
		Object.keys(data).forEach(key => {
			this[key] = data[key];
		});
	}

	/**
	 * Logins as User, Standard Call.
	 * Data contains:
	 * @param {String} username 
	 * @param {String} password
	 * @param {Integer} totp_code [Optional]
	 * @returns Response Promise, Exception on Failure.
	 */
	async login(data) {
		return await interlock_backend.call('auth/login', data)
	}

	/**
	 * Logs out the current User, Standard Call.
	 */
	async logout() {
		return await interlock_backend.call('auth/logout')
	}

	async list() {
		return await interlock_backend.call('user/list')
	}

	async insert(data) {
		return await interlock_backend.call('user/insert', data)
	}

	async fetch(username) {
		return await interlock_backend.call('user/fetch', { username: username }).then(
			response => {
				if (!response)
					throw Error("Error fetching user data. Provider returned: " + response);
				else {
					Object.keys(response.data).forEach(key => {
						switch (key) {
							default:
								this[key] = response.data[key];
								break;
						}
					});
				}
			}
		)
	}

	async update(data) {
		return await interlock_backend.call('user/update', data)
	}

	async delete(data) {
		return await interlock_backend.call('user/delete', data)
	}

	async changeAccountStatus(data) {
		return await interlock_backend.call('user/changeAccountStatus', data)
	}

	async lock(data) {
		return await interlock_backend.call('user/lock', data)
	}

	async unlock(data) {
		return await interlock_backend.call('user/unlock', data)
	}

	async deleteTotp(data) {
		return await interlock_backend.call('user/deleteTotp', data)
	}

	async changePassword(data) {
		return await interlock_backend.call('user/changePassword', data)
	}

	async selfChangePassword(data) {
		return await interlock_backend.call('user/selfChangePassword', data)
	}

	async selfFetch() {
		return await interlock_backend.call('user/selfFetch').then(
			response => {
				if (!response)
					throw Error("Error fetching user data. Provider returned: " + response);
				else {
					Object.keys(response.data).forEach(key => {
						switch (key) {
							case 'whenChanged':
							case 'whenCreated':
								this[key] = dateLdapToString(response.data[key]);
								break;
							case 'lastLogon':
							case 'pwdLastSet':
								this[key] = dateFromFiletime(response.data[key]);
								break;
							default:
								this[key] = response.data[key];
								break;
						}
					});
				}
			}
		)
	}

	async selfInfo() {
		return await interlock_backend.call('user/selfInfo')
	}

	async selfUpdate(data) {
		return await interlock_backend.call('user/selfUpdate', data)
	}

	async bulkInsert(data) {
		return await interlock_backend.call('user/bulkInsert', data)
	}

	async bulkDelete(data) {
		return await interlock_backend.call('user/bulkDelete', data)
	}

	async bulkUpdate(data) {
		return await interlock_backend.call('user/bulkUpdate', data)
	}

	async bulkChangeStatus(data) {
		return await interlock_backend.call('user/bulkChangeStatus', data)
	}

	async bulkUnlock(data) {
		return await interlock_backend.call('user/bulkUnlock', data)
	}
}

export default User