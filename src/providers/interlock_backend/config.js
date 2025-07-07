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
    .then(function (json) {
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
const base_url = urlPrefix + local_config.backend_url + "/";
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
const urls = {
    home: {
        fetch: `api/home/`
    },
    auth: {
        token: `api/token/`,
        tokenRefresh: `api/token/refresh/`,
        logout: `api/token/revoke/`
    },
    user: {
        base: `api/ldap/users/`,
        fetch: `api/ldap/users/retrieve/`,
        deleteTotp: `api/totp/delete-for-user/`,
        lock: `api/ldap/users/lock/`,
        unlock: `api/ldap/users/unlock/`,
        changeAccountStatus: `api/ldap/users/change-status/`,
        changePassword: `api/ldap/users/change-password/`,
        bulkInsert: `api/ldap/users/bulk/create/`,
        bulkDelete: `api/ldap/users/bulk/destroy/`,
        bulkUpdate: `api/ldap/users/bulk/update/`,
        bulkUnlock: `api/ldap/users/bulk/unlock/`,
        bulkChangeStatus: `api/ldap/users/bulk/change-status/`,
        bulkExport: `api/ldap/users/bulk/export/`,
        // These endpoints will be moved to a separate viewset
        selfChangePassword: `api/ldap/users/self/change-password/`,
        selfUpdate: `api/ldap/users/self/update/`,
        selfFetch: `api/ldap/users/self/fetch/`,
        selfInfo: `api/ldap/users/self/info/`,
        //
    },
    djangoUser: {
        base: `api/users/`,
        detail: `api/users/{pk}/`,
        changeAccountStatus: `api/users/{pk}/change-status/`,
        changePassword: `api/users/{pk}/change-password/`,
        // These endpoints will be moved to a separate viewset
        selfUpdate: `api/users/self/update/`,
        selfChangePassword: `api/users/self/change-password/`,
        //
        bulkInsert: `api/users/bulk/create/`,
        bulkDelete: `api/users/bulk/destroy/`,
        bulkUpdate: `api/users/bulk/update/`,
        bulkChangeStatus: `api/users/bulk/change-status/`,
        bulkExport: `api/users/bulk/export/`,
    },
    group: {
        base: `api/ldap/groups/`,
        fetch: `api/ldap/groups/retrieve-dn/`,
    },
    log: {
        base: `api/logs/`,
        list: `api/logs/`,
        reset: `api/logs/reset/`,
        truncate: `api/logs/truncate/`
    },
    domain: {
        base: `api/ldap/domain/`,
        zone: `api/ldap/domain/zone/`,
    },
    dnsr: {
        base: `api/ldap/record/`,
    },
    gpo: {
        list: `api/ldap/gpo/`,
    },
    settings: {
        base: `api/settings/`,
        detail: `api/settings/{pk}/`,
        preset_enable: `api/settings/{pk}/enable/`,
        preset_rename: `api/settings/{pk}/rename/`,
        save: `api/settings/save/`,
        reset: `api/settings/reset/`,
        test: `api/settings/test/`,
        sync_users: `api/settings/sync-users/`,
        prune_users: `api/settings/prune-users/`,
        purge_users: `api/settings/purge-users/`,
    },
    dirtree: {
        base: `api/ldap/dirtree/`,
        organizational_units: `api/ldap/dirtree/organizational-units/`,
        move: `api/ldap/dirtree/move/`,
        rename: `api/ldap/dirtree/rename/`,
    },
    totp: {
        list: `api/totp/`,
        create: `api/totp/create-device/`,
        validate: `api/totp/validate-device/`,
        delete: `api/totp/delete-device/`,
    },
    test: {
        get: `api/test/`,
        post: `api/test/post/`,
        put: `api/test/put/`,
        delete: `api/test/delete/`,
        options: `api/test/options/`
    },
    liveness: {
        check: `api/liveness/`
    },
    debug: {
        list: `api/debug/`,
        action: `api/debug/action/`,
    },
    application: {
        base: `api/application/`,
        detail: `api/application/{pk}/`,
        oidc_well_known: "openid/.well-known/openid-configuration/",
    },
    applicationGroup: {
        base: `api/application/group/`,
        detail: `api/application/group/{pk}/`,
        change_status: `api/application/group/{pk}/change-status/`,
        create_info: `api/application/group/create-info/`,
    },
    oidc: {
        consent: `openid/consent/`,
        reject: `openid/reject/`,
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
    localUserKeys.forEach(v => {
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
            return tokenRefreshAxios.post(base_url + urls.auth.tokenRefresh)
                // then, if refresh request succeeds.
                .then(response => {
                    tokenIsRefreshing = false
                    var date = new Date()
                    // 1) Set tokens on LocalStorage.
                    localStorage.setItem('auth.refresh_clock', date)
                    localStorage.setItem('auth.access_expire', response.data.access_expire)
                    localStorage.setItem('auth.refresh_expire', response.data.refresh_expire)
                    // 2) Return re-sent request through new axios.
                    return axios(originalRequest);
                    // on refresh request error catch
                }).catch((e) => {
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
    base_url: base_url,
    urls: urls,
    request: request
};
