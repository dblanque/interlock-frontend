import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'
import { dateLdapToString, dateFromFiletime } from '@/include/utils.js'

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
    memberOfObjects;
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
     * Data contains:
     * @param {String} username 
     * @param {String} password
     * @param {Integer} totp_code [Optional]
     * @returns Response Promise, Exception on Failure.
     */
    async login(data){
        return await interlock_backend.call('auth/login', data)
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

    async bulkInsert(data){
        return await interlock_backend.call('user/bulkInsert', data)
    }

    async bulkDelete(data){
        return await interlock_backend.call('user/bulkDelete', data)
    }

    async bulkUpdate(data){
        return await interlock_backend.call('user/bulkUpdate', data)
    }

    async bulkAccountStatusChange(data){
        return await interlock_backend.call('user/bulkAccountStatusChange', data)
    }

    async bulkUnlock(data){
        return await interlock_backend.call('user/bulkUnlock', data)
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

    async changePassword(data){
        return await interlock_backend.call('user/changePassword', data)
    }

    async changePasswordSelf(data){
        return await interlock_backend.call('user/changePasswordSelf', data)
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

    async fetchme(){
        return await interlock_backend.call('user/fetchme').then(
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

    async updateSelf(data){
        return await interlock_backend.call('user/updateSelf', data)
    }
}

export default User