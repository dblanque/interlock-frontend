import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Group extends ApiModel{
    
    cn;
    displayName;
    mail;
    member;
    dn;
    sAMAccountName;

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
        return interlock_backend.call('group/list')
    }

    dirtree(){
        return interlock_backend.call('group/dirtree')
    }
}

export default Group