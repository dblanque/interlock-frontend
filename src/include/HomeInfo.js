import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class HomeInfo extends ApiModel {

	local_user_count = 0;
	oidc_well_known = {};
	ldap_user_count = 0;
	ldap_enabled = false;
	ldap_tls = false;
	ldap_ssl = false;
	ldap_ok = false;
	ldap_active_server = null;
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

	async fetch() {
		return await interlock_backend.call('home/fetch')
			.then(response => {
				const data = response.data.data
				Object.keys(data).forEach(key => {
					this[key] = data[key];
				})
			})
	}
}

export default HomeInfo