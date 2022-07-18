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

    list(){
        return interlock_backend.call('ou/list')
    }

    save(){
        return interlock_backend.call('ou/save')
    }
}

export default Settings