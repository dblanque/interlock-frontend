// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// Contributors
//  - Dylan Blanqué
//  - Martín Vilche
// File: config.js

import axios from "axios";
import router from "@/router.js"

export const getRuntimeConfig = async () => {
    const runtimeConfig = await fetch('/config/local.json');
    return await runtimeConfig.json()
}

const local_config = await getRuntimeConfig()
.then(function(json) {
    return {
        backend_url: json.backend_url,
        ssl: json.ssl,
        reject_unauthorized: json.reject_unauthorized,
        version: json.version
    }
})

// Sets content type to json utf-8 default.
axios.defaults.headers.common["content-type"] = "application/json;charset=utf-8";

// SSL
let urlPrefix
// Default back-end provider urls.
// ! PLEASE INCLUDE '/' at the end of URL.
if (local_config.ssl == true) {
    urlPrefix = "https://"
}
else {
    urlPrefix = "http://"
}
const base_url =  urlPrefix + local_config.backend_url + "/";
// const base_url =  "http://127.0.0.1:8000/";

var request
let axios_opts
// Axios Instance.
if (local_config.reject_unauthorized != true) {
    axios_opts = {
        baseURL: base_url,
        withCredentials: true,
        rejectUnauthorized: false
    }
}
else {
    axios_opts = {
        baseURL: base_url,
        withCredentials: true,
        rejectUnauthorized: true
    }
}
request = axios.create(axios_opts);

export const ignoreErrorCodes = [
    401, // Unauthorized
    403 // Forbidden
]

// LIST OF URL PATTERNS.
const apiPrefix = "api"
const urls = {
    home: {
        fetch: `${apiPrefix}/home/`
    },
    auth: {
        token: `${apiPrefix}/token/`,
        tokenRefresh: `${apiPrefix}/token/refresh/`,
        logout: `${apiPrefix}/token/revoke/`
    },
    user: {
        list: `${apiPrefix}/ldap/users/`,
        fetch: `${apiPrefix}/ldap/users/fetch/`,
        insert: `${apiPrefix}/ldap/users/insert/`,
        bulkInsert: `${apiPrefix}/ldap/users/bulk_insert/`,
        bulkDelete: `${apiPrefix}/ldap/users/bulk_delete/`,
        bulkUpdate: `${apiPrefix}/ldap/users/bulk_update/`,
        bulkChangeStatus: `${apiPrefix}/ldap/users/bulk_change_status/`,
        bulkUnlock: `${apiPrefix}/ldap/users/bulk_unlock/`,
        update: `${apiPrefix}/ldap/users/update/`,
        delete: `${apiPrefix}/ldap/users/delete/`,
        deleteTotp: `${apiPrefix}/totp/delete_for_user/`,
        changeAccountStatus: `${apiPrefix}/ldap/users/change_status/`,
        lock: `${apiPrefix}/ldap/users/lock/`,
        unlock: `${apiPrefix}/ldap/users/unlock/`,
        changePassword: `${apiPrefix}/ldap/users/change_password/`,
        selfChangePassword: `${apiPrefix}/ldap/users/self_change_password/`,
        selfUpdate: `${apiPrefix}/ldap/users/self_update/`,
        selfFetch: `${apiPrefix}/ldap/users/self_fetch/`,
        selfInfo: `${apiPrefix}/ldap/users/self_info/`,
    },
    djangoUser: {
        list: `${apiPrefix}/users/`,
        fetch: `${apiPrefix}/users/{pk}/fetch/`,
        insert: `${apiPrefix}/users/insert/`,
        update: `${apiPrefix}/users/{pk}/`,
        delete: `${apiPrefix}/users/{pk}/delete/`,
        changeAccountStatus: `${apiPrefix}/users/{pk}/change_status/`,
        changePassword: `${apiPrefix}/users/{pk}/change_password/`,
        selfUpdate: `${apiPrefix}/users/self_update/`,
        selfChangePassword: `${apiPrefix}/users/self_change_password/`,
        selfFetch: `${apiPrefix}/users/self_fetch/`,
        bulkInsert: `${apiPrefix}/users/bulk/insert/`,
        bulkDelete: `${apiPrefix}/users/bulk/delete/`,
        bulkUpdate: `${apiPrefix}/users/bulk/update/`,
        bulkChangeStatus: `${apiPrefix}/users/bulk/change-status/`,
    },
    group: {
        base: `${apiPrefix}/ldap/groups/`,
        list: `${apiPrefix}/ldap/groups/`,
        fetch: `${apiPrefix}/ldap/groups/fetch/`,
        save: `${apiPrefix}/ldap/groups/save/`,
        insert: `${apiPrefix}/ldap/groups/insert/`,
        update: `${apiPrefix}/ldap/groups/update/`,
        delete: `${apiPrefix}/ldap/groups/delete/`,
    },
    log: {
        base: `${apiPrefix}/logs/`,
        list: `${apiPrefix}/logs/`,
        reset: `${apiPrefix}/logs/reset/`,
        truncate: `${apiPrefix}/logs/truncate/`
    },
    domain: {
        base: `${apiPrefix}/ldap/domain/`,
        details: `${apiPrefix}/ldap/domain/details/`,
        zones: `${apiPrefix}/ldap/domain/zones/`,
        insert: `${apiPrefix}/ldap/domain/insert/`,
        delete: `${apiPrefix}/ldap/domain/delete/`,
    },
    dnsr: {
        insert: `${apiPrefix}/ldap/record/insert/`,
        update: `${apiPrefix}/ldap/record/update/`,
        delete: `${apiPrefix}/ldap/record/delete/`,
    },
    gpo: {
        list: `${apiPrefix}/ldap/gpo/`,
    },
    settings: {
        base: `${apiPrefix}/settings/`,
        list: `${apiPrefix}/settings/`,
        fetch: `${apiPrefix}/settings/fetch/`,
        save: `${apiPrefix}/settings/save/`,
        reset: `${apiPrefix}/settings/reset/`,
        test: `${apiPrefix}/settings/test/`,
        sync_users: `${apiPrefix}/settings/sync_users/`,
        prune_users: `${apiPrefix}/settings/prune_users/`,
        purge_users: `${apiPrefix}/settings/purge_users/`,
        preset_create: `${apiPrefix}/settings/preset_create/`,
        preset_delete: `${apiPrefix}/settings/preset_delete/`,
        preset_rename: `${apiPrefix}/settings/preset_rename/`,
        preset_enable: `${apiPrefix}/settings/preset_enable/`,
    },
    ou: {
        base: `${apiPrefix}/ldap/ou/`,
        list: `${apiPrefix}/ldap/ou/`,
        insert: `${apiPrefix}/ldap/ou/insert/`,
        delete: `${apiPrefix}/ldap/ou/delete/`,
        filter: `${apiPrefix}/ldap/ou/filter/`,
        dirtree: `${apiPrefix}/ldap/ou/dirtree/`,
        move: `${apiPrefix}/ldap/ou/move/`,
        rename: `${apiPrefix}/ldap/ou/rename/`,
    },
    totp: {
        list: `${apiPrefix}/totp/`,
        create: `${apiPrefix}/totp/create_device/`,
        validate: `${apiPrefix}/totp/validate_device/`,
        delete: `${apiPrefix}/totp/delete_device/`,
    },
    test: {
        get: `${apiPrefix}/test/`,
        post: `${apiPrefix}/test/post/`,
        put: `${apiPrefix}/test/put/`,
        delete: `${apiPrefix}/test/delete/`,
        options: `${apiPrefix}/test/options/`
    },
    liveness: {
        check: `${apiPrefix}/liveness/check/`
    },
    debug: {
        list: `${apiPrefix}/debug/`,
        action: `${apiPrefix}/debug/action/`,
    },
    application: {
        list: `${apiPrefix}/application/`,
        insert: `${apiPrefix}/application/insert/`,
        update: `${apiPrefix}/application/{pk}/`,
        fetch: `${apiPrefix}/application/{pk}/fetch/`,
        delete: `${apiPrefix}/application/{pk}/delete/`,
        oidc_well_known: "openid/.well-known/openid-configuration/",
    },
    applicationGroup: {
        list: `${apiPrefix}/application/group/`,
        fetch: `${apiPrefix}/application/group/{pk}/`,
        insert: `${apiPrefix}/application/group/insert/`,
        update: `${apiPrefix}/application/group/{pk}/`,
        delete: `${apiPrefix}/application/group/{pk}/delete/`,
        change_status: `${apiPrefix}/application/group/{pk}/change_status/`,
        create_info: `${apiPrefix}/application/group/create_info/`,
    },
    oidc: {
        consent: `openid/consent/`,
        end_session: `openid/end-session/`
    }
}
const eraseLocalUserData = () => {
    const localUserKeys = [
        "first_name",
        "last_name",
        "username",
        "email",
        "admin_allowed",
    ]
    localUserKeys.forEach(v=>{
        localStorage.removeItem(`user.${v}`)
    })
    return
}

var tokenIsRefreshing = false

const forToken = async () => {
    console.log("Waiting for token refresh.")
    let tokenRefreshCountLimit = 20;
    let tokenRefreshWaitLimit = 500;
    let tokenRefreshWait = 0;
    while (tokenIsRefreshing === true && await (new Promise(resolve => setTimeout(() => resolve(tokenRefreshWait), tokenRefreshWaitLimit))) < tokenRefreshCountLimit) {
        tokenRefreshWait++
    }
    return
}

// Add a request interceptor
request.interceptors.request.use(
    async function (config) {
        if (tokenIsRefreshing === true)
            await forToken()
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
});

// Adds Axios Response Interceptor.
request.interceptors.response.use(
    // On Request Success...
    (response) => {
        // do nothing.
        return response
    }, 
    // On Request Error...
    async (error) => {
        // Get Configuration of failed request.
        const originalRequest = error.config;
        if (error?.response?.status == undefined) {
            console.error("HTTP Status undefined, going back to login.")
            // erase local storage and go to Index Login.
            eraseLocalUserData()
            if (router.app.$route.path != "/login")
                router.push('/login')
        }
        // If the request error code is 403 and the request hasn't been retried...
        if (error.response.status === 401 && !originalRequest._retry) {
            if (tokenIsRefreshing === true) {
                await forToken();
                return axios(originalRequest); // Resends
            }
            tokenIsRefreshing = true
            // Check flag for request being retried.
            originalRequest._retry = true;
            // Send refresh token request.
            let tokenRefreshAxios = axios.create(axios_opts)
            return tokenRefreshAxios.post(base_url+urls.auth.tokenRefresh)
            // then, if refresh request succeeds.
            .then(response => {
                tokenIsRefreshing = false
                var date = new Date()
                // 1) Set tokens on LocalStorage.
                localStorage.setItem('auth.refreshClock', date)
                localStorage.setItem('auth.access_expire', response.data.access_expire)
                localStorage.setItem('auth.refresh_expire', response.data.refresh_expire)
                // 2) Return re-sent request through new axios.
                return axios(originalRequest);
            // on refresh request error catch
            }).catch((e)=>{
                tokenIsRefreshing = false
                if (e.status != undefined && !ignoreErrorCodes.includes(e.status))
                    console.error(e)
                if (e?.response?.status == 401) {
                    // erase local storage and go to Index Login.
                    eraseLocalUserData()
                    if (router.app.$route.path != "/login")
                        router.push('/login')
                }
                return Promise.reject(error.response)
            })
        // Else, if the error is other than Unauthorized...
        } else
            // Return error response.
            return Promise.reject(error)
    }
)// End of Interceptor.

export default {
    urls: urls,
    request: request
};
