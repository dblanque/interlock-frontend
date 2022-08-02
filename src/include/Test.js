import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Test extends ApiModel{
    
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

    async get(){
        return await interlock_backend.call('test/get')
    }
    async post(data){
        return await interlock_backend.call('test/post', data)
    }
    async put(data){
        return await interlock_backend.call('test/put', data)
    }
    async delete(data){
        return await interlock_backend.call('test/delete', data)
    }
    async options(data){
        return await interlock_backend.call('test/options', data)
    }
}

export default Test