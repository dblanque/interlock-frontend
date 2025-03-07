import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Group extends ApiModel{
    
    _callsPrefix = "group/"
    cn;
    displayName;
    mail;
    member;
    distinguishedName;
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

    async list(){
        return await interlock_backend.call(this._getEndpoint("list"))
    }

    async fetch(groupdn){
        return await interlock_backend.call(this._getEndpoint("fetch"), {group: groupdn}).then(
            response => {
                if(!response)
                        throw Error("Error fetching user data. Provider returned: " + response);
                else{
                    Object.keys(response.data).forEach(key => {
                        this[key] = response.data[key];
                    });
                }
            }
        )
    }

    async insert(group){
        return await interlock_backend.call(this._getEndpoint("insert"), group)
    }

    async update(group){
        return await interlock_backend.call(this._getEndpoint("update"), group)
    }

    async delete(group){
        return await interlock_backend.call(this._getEndpoint("delete"), group)
    }
}

export default Group