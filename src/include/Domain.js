import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Domain extends ApiModel{

    domain;
    realm;
    
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

    async getDetails(){
        return await interlock_backend.call('domain/details')
    }
}

export default Domain