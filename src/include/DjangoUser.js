import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

const callsPrefix = "djangoUser"
class DjangoUser extends ApiModel {

	first_name;
	last_name;
	username;
	password;
	user_type;
	is_enabled;
	email;

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

	async list() {
		return await interlock_backend.call(`${callsPrefix}/list`)
	}

	async fetch(id) {
		return await interlock_backend.call(`${callsPrefix}/fetch`, id).then(
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

	async insert(data) {
		return await interlock_backend.call(`${callsPrefix}/insert`, data)
	}

	async update(data) {
		return await interlock_backend.call(`${callsPrefix}/update`, data)
	}

	async delete(id) {
		return await interlock_backend.call(`${callsPrefix}/delete`, id)
	}

	async changeAccountStatus(data) {
		return await interlock_backend.call(`${callsPrefix}/changeAccountStatus`, data)
	}

	async changePassword(data) {
		return await interlock_backend.call(`${callsPrefix}/changePassword`, data)
	}

	async selfChangePassword(data) {
		return await interlock_backend.call(`${callsPrefix}/selfChangePassword`, data)
	}

	async selfFetch() {
		return await interlock_backend.call(`${callsPrefix}/selfFetch`).then(
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

	async selfUpdate(data) {
		return await interlock_backend.call(`${callsPrefix}/selfUpdate`, data)
	}

	async selfInfo() {
		return await interlock_backend.call(`${callsPrefix}/selfInfo`)
	}

	async bulkInsert(data) {
		return await interlock_backend.call(`${callsPrefix}/bulkInsert`, data)
	}

	async bulkDelete(data) {
		return await interlock_backend.call(`${callsPrefix}/bulkDelete`, data)
	}

	async bulkUpdate(data) {
		return await interlock_backend.call(`${callsPrefix}/bulkUpdate`, data)
	}

	async bulkStatusChange(data) {
		return await interlock_backend.call(`${callsPrefix}/bulkStatusChange`, data)
	}
}

export default DjangoUser