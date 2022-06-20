import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class User extends ApiModel{

    first_name;
    last_name;
    username;
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
     * @param {String} username 
     * @param {String} password 
     * @returns Response Promise, Exception on Failure.
     */
    login(username, password){
        const params = {username: username,password: password}
        return interlock_backend.call('auth/login', params)
    }

    /**
     * Logs out the current User, Standard Call.
     */
    logout(){
        return interlock_backend.call('auth/logout')
    }

    list(){
        return interlock_backend.call('user/list')
    }

    getCurrentUserData(){
        return interlock_backend.call('user/getCurrentUserData')
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