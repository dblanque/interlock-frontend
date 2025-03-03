import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Application extends ApiModel{

		name;
		client_id;
		client_secret;
		redirect_uris;
		scopes;
        response_types;
        request_consent;
        reuse_consent;
        enabled;
    /**
     * Fetches model instance from API by id.
     * @param {Number} id 
     */
     constructor(data){
        super(data)
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    async list(){
        return await interlock_backend.call('application/list')
    }

    async oidc_well_known(){
        return await interlock_backend.call('application/oidc_well_known')
    }

    async insert(data){
        return await interlock_backend.call('application/insert', data)
    }

    async delete(data){
        return await interlock_backend.call('application/delete', data)
    }

    async fetch(id){
        return await interlock_backend.call('application/fetch', id)
    }

    async update(data){
        return await interlock_backend.call('application/update', data)
    }
}

export default Application