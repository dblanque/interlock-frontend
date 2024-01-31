import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Debug extends ApiModel{

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
        return await interlock_backend.call('debug/list')
    }

    async action(data){
        return await interlock_backend.call('debug/action', data)
    }
}

export default Debug