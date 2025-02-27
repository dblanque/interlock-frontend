import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Application extends ApiModel{

		name;
		client_id;
		client_secret;
		redirect_uris;
		scopes;
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

    async insert(data){
        return await interlock_backend.call('application/insert', data)
    }
}

export default Application