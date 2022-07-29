import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class OrganizationalUnit extends ApiModel{
    
    dn;
    attributes;

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
        return await interlock_backend.call('ou/list')
    }

    async filter(objectArray){
        return await interlock_backend.call('ou/listfilter', objectArray)
    }

    async dirtree(filter){
        return await interlock_backend.call('ou/dirtree', filter)
    }

    async move(data){
        return await interlock_backend.call('ou/move', data)
    }
}

export default OrganizationalUnit