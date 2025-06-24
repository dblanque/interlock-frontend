import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class ApplicationGroup extends ApiModel {

	name;
	enabled;
	application;
	users;
	ldap_objects;

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

	async create_info() {
		return await interlock_backend.call("applicationGroup/create_info")
	}

	async list() {
		return await interlock_backend.call("applicationGroup/list")
	}

	async fetch(id) {
		return await interlock_backend.call("applicationGroup/fetch", id).then(
			response => {
				if (!response)
					throw Error("Error fetching user data. Provider returned: " + response);
				else {
					Object.keys(response.data).forEach(key => {
						this[key] = response.data[key];
					});
				}
			}
		)
	}

	async update(data) {
		return await interlock_backend.call("applicationGroup/update", data)
	}

	async change_status(data) {
		return await interlock_backend.call("applicationGroup/change_status", data)
	}

	async delete(id) {
		return await interlock_backend.call("applicationGroup/delete", id)
	}

	async insert(data) {
		return await interlock_backend.call("applicationGroup/insert", data)
	}
}

export default ApplicationGroup