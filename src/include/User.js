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
    givenName; 
    sn; 
    displayName;
    mail;
    telephoneNumber;
    streetAddress;
    postalCode;
    // Locale / City
    l;
    // State/Province
    st;
    // INT
    countryCode;
    // 2 Letter Code for Country
    co;
    // Full Country Name
    c;
    wWWHomePage;
    distinguishedName;
    userPrincipalName;
    // Permission ACLs
    userAccountControl;
    whenCreated;
    whenChanged;
    lastLogon;
    badPwdCount;
    pwdLastSet;
    primaryGroupID;
    objectClass;
    objectCategory;
    sAMAccountName;
    sAMAccountType;

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
    async login(username, password){
        const params = {username: username,password: password}
        return await interlock_backend.call('auth/login', params)
    }

    /**
     * Logs out the current User, Standard Call.
     */
    async logout(){
        return await interlock_backend.call('auth/logout')
    }

    async list(){
        return await interlock_backend.call('user/list')
    }

    async fetch(username){
        return await interlock_backend.call('user/fetch', {username: username}).then(
            response => {
                if(!response)
                        throw Error("Error fetching user data. Provider returned: " + response);
                    else{
                        Object.keys(response.data).forEach(key => {
                            console.log(key)
                            this[key] = response.data[key];
                        });
                    }
            }
        )
    }

    async getCurrentUserData(){
        return await interlock_backend.call('user/getCurrentUserData')
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
        return interlock_backend.call(linkString, this)
    }
}

export default User