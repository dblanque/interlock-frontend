import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'
import { dateLdapToString, dateFromFiletime } from '@/include/utils'

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
    permission_list;

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

    async insert(data){
        return await interlock_backend.call('user/insert', data)
    }

    async enable(data){
        return await interlock_backend.call('user/enable', data)
    }

    async disable(data){
        return await interlock_backend.call('user/disable', data)
    }

    async lock(data){
        return await interlock_backend.call('user/lock', data)
    }

    async unlock(data){
        return await interlock_backend.call('user/unlock', data)
    }

    async delete(data){
        return await interlock_backend.call('user/delete', data)
    }

    async fetch(username){
        return await interlock_backend.call('user/fetch', {username: username}).then(
            response => {
                if(!response)
                        throw Error("Error fetching user data. Provider returned: " + response);
                    else{
                        Object.keys(response.data).forEach(key => {
                            switch (key) {
                                case 'whenChanged':
                                case 'whenCreated':
                                    this[key] = dateLdapToString(response.data[key]);
                                    break;
                                case 'lastLogon':
                                case 'pwdLastSet':
                                    this[key] = dateFromFiletime(response.data[key]);
                                    break;
                                default:
                                    this[key] = response.data[key];
                                    break;
                            }
                        });
                    }
            }
        )
    }

    async getCurrentUserData(){
        return await interlock_backend.call('user/getCurrentUserData')
    }

    async update(data){
        return await interlock_backend.call('user/update', data)
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