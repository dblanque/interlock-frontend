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
    auth: {
        token: `${apiPrefix}/token/`,
        tokenRefresh: `${apiPrefix}/token/refresh/`,
        logout: `${apiPrefix}/token/revoke/`
    },
    user: {
        list: `${apiPrefix}/users/`,
        fetch: `${apiPrefix}/users/fetch/`,
        insert: `${apiPrefix}/users/insert/`,
        bulkInsert: `${apiPrefix}/users/bulk_insert/`,
        bulkDelete: `${apiPrefix}/users/bulk_delete/`,
        bulkUpdate: `${apiPrefix}/users/bulk_update/`,
        bulkStatusChange: `${apiPrefix}/users/bulk_status_change/`,
        bulkUnlock: `${apiPrefix}/users/bulk_unlock/`,
        update: `${apiPrefix}/users/update/`,
        delete: `${apiPrefix}/users/delete/`,
        deleteTotp: `${apiPrefix}/totp/delete_for_user/`,
        changeAccountStatus: `${apiPrefix}/users/change_status/`,
        lock: `${apiPrefix}/users/lock/`,
        unlock: `${apiPrefix}/users/unlock/`,
        changePassword: `${apiPrefix}/users/change_password/`,
        selfChangePassword: `${apiPrefix}/users/self_change_password/`,
        selfUpdate: `${apiPrefix}/users/self_update/`,
        selfFetch: `${apiPrefix}/users/self_fetch/`,
        selfInfo: `${apiPrefix}/users/self_info/`,
    },
    djangoUser: {
        list: `${apiPrefix}/users/local/`,
        fetch: `${apiPrefix}/users/local/{pk}/fetch/`,
        insert: `${apiPrefix}/users/local/insert/`,
        update: `${apiPrefix}/users/local/{pk}/`,
        delete: `${apiPrefix}/users/local/{pk}/delete/`,
        changeAccountStatus: `${apiPrefix}/users/local/{pk}/change_status/`,
        changePassword: `${apiPrefix}/users/local/{pk}/change_password/`,
        selfUpdate: `${apiPrefix}/users/local/self_update/`,
        selfChangePassword: `${apiPrefix}/users/local/self_change_password/`,
        selfFetch: `${apiPrefix}/users/local/self_fetch/`,
        bulkInsert: `${apiPrefix}/users/local/bulk_insert/`,
        bulkDelete: `${apiPrefix}/users/local/bulk_delete/`,
        bulkUpdate: `${apiPrefix}/users/local/bulk_update/`,
        bulkStatusChange: `${apiPrefix}/users/local/bulk_status_change/`,
    },
    group: {
        base: `${apiPrefix}/groups/`,
        list: `${apiPrefix}/groups/`,
        fetch: `${apiPrefix}/groups/fetch/`,
        save: `${apiPrefix}/groups/save/`,
        insert: `${apiPrefix}/groups/insert/`,
        update: `${apiPrefix}/groups/update/`,
        delete: `${apiPrefix}/groups/delete/`,
    },
    log: {
        base: `${apiPrefix}/logs/`,
        list: `${apiPrefix}/logs/`,
        reset: `${apiPrefix}/logs/reset/`,
        truncate: `${apiPrefix}/logs/truncate/`
    },
    domain: {
        base: `${apiPrefix}/domain/`,
        details: `${apiPrefix}/domain/details/`,
        zones: `${apiPrefix}/domain/zones/`,
        insert: `${apiPrefix}/domain/insert/`,
        delete: `${apiPrefix}/domain/delete/`,
    },
    dnsr: {
        insert: `${apiPrefix}/record/insert/`,
        update: `${apiPrefix}/record/update/`,
        delete: `${apiPrefix}/record/delete/`,
    },
    gpo: {
        list: `${apiPrefix}/gpo/`,
    },
    settings: {
        base: `${apiPrefix}/settings/`,
        list: `${apiPrefix}/settings/`,
        fetch: `${apiPrefix}/settings/fetch/`,
        save: `${apiPrefix}/settings/save/`,
        reset: `${apiPrefix}/settings/reset/`,
        test: `${apiPrefix}/settings/test/`,
        preset_create: `${apiPrefix}/settings/preset_create/`,
        preset_delete: `${apiPrefix}/settings/preset_delete/`,
        preset_rename: `${apiPrefix}/settings/preset_rename/`,
        preset_enable: `${apiPrefix}/settings/preset_enable/`,
    },
    ou: {
        base: `${apiPrefix}/ou/`,
        list: `${apiPrefix}/ou/`,
        insert: `${apiPrefix}/ou/insert/`,
        delete: `${apiPrefix}/ou/delete/`,
        filter: `${apiPrefix}/ou/filter/`,
        dirtree: `${apiPrefix}/ou/dirtree/`,
        move: `${apiPrefix}/ou/move/`,
        rename: `${apiPrefix}/ou/rename/`,
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
        create_info: `${apiPrefix}/application/group/create_info/`,
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
