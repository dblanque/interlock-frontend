import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Oidc extends ApiModel {
	client_id;
	redirect_uri;
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

	async consent(data) {
		return await interlock_backend.call('oidc/consent', data)
	}

	async reject(data) {
		return await interlock_backend.call('oidc/reject', data)
	}
}

export default Oidc