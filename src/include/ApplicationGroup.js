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

	async fetch(groupdn) {
		return await interlock_backend.call(this._getEndpoint("fetch"), { group: groupdn }).then(
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

	async update(group) {
		return await interlock_backend.call(this._getEndpoint("update"), group)
	}

	async insert(group) {
		return await interlock_backend.call(this._getEndpoint("insert"), group)
	}
}

export default ApplicationGroup