import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Settings extends ApiModel{
    
    key;
    value;

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
        return await interlock_backend.call('settings/list')
    }

    async reset(){
        return await interlock_backend.call('settings/reset')
    }

    async test(data){
        return await interlock_backend.call('settings/test', data)
    }

    async save(data){
        return await interlock_backend.call('settings/save', data)
    }
}

export default Settings