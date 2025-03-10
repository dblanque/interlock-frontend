import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class ApplicationGroup extends ApiModel {
	_callsPrefix = "applicationGroup/"

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
		return await interlock_backend.call(this._getEndpoint("create_info"))
	}

	async list() {
		return await interlock_backend.call(this._getEndpoint("list"))
	}

	async fetch(id) {
		return await interlock_backend.call(this._getEndpoint("fetch"), id).then(
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
		return await interlock_backend.call(this._getEndpoint("update"), data)
	}

	async change_status(data) {
		return await interlock_backend.call(this._getEndpoint("change_status"), data)
	}

	async delete(id) {
		return await interlock_backend.call(this._getEndpoint("delete"), id)
	}

	async insert(data) {
		return await interlock_backend.call(this._getEndpoint("insert"), data)
	}
}

export default ApplicationGroup