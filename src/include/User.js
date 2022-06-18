import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class User extends ApiModel{

    first_name;
    last_name;
    email;
    password;
    last_login;
    role;
    is_staff;
    
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

    /**
     * Logins as User, Standard Call.
     * @param {String} email 
     * @param {String} password 
     * @returns Response Promise, Exception on Failure.
     */
    login(email, password){
        const params = {email: email,password: password}
        return interlock_backend.call('auth/login', params)
    }

    list(){
        return interlock_backend.call('user/list')
    }

    _validate(){
        this.phone?.replace(/-. /g,'')
    }

    getById(id){
        if(typeof id != "number" || id == 0)
            throw Error("Error constructing User instance. `id` param is not a number or is 0.");
        else{
            interlock_backend.call('user/getById', id).then(
                response => {
                    if(!response)
                        throw Error("Error fetching User Data. Provider returned: " + response);
                    else{
                        Object.keys(response).forEach(key => {
                            this[key] = response[key];
                        });
                    }
                }
            )
        }
    }

    /**
     * Fetches provider to save model data.
     * [!] Null ID determines to update or create instance.
     */
     save(){
        var linkString = "";
        if(!this.role)
            this.role = 'customer'
        if(!this.id )
            linkString = 'user/insert'
        else if (typeof this.id != "number" || this.id == 0)
            throw Error("Error saving User instance. `id` param is not a number or is 0.");
        else
            linkString = 'user/update'
        this._validate()
        return interlock_backend.call(linkString, this)
    }
}

export default User