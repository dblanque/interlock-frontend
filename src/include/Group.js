import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Group extends ApiModel {

	cn;
	displayName;
	mail;
	member;
	distinguishedName;
	sAMAccountName;

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
		return await interlock_backend.call("group/list")
	}

	async fetch(distinguishedName) {
		return await interlock_backend.call("group/fetch", { group: distinguishedName }).then(
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

	async insert(data) {
		return await interlock_backend.call("group/insert", data)
	}

	async update(data) {
		return await interlock_backend.call("group/update", data)
	}

	async delete(data) {
		return await interlock_backend.call("group/delete", data)
	}
}

export default Group