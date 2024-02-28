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

// LIST OF URL PATTERNS.
const urls = {
    auth: {
        token: 'api/token/',
        tokenRefresh: 'api/token/refresh/',
        logout: 'api/token/revoke/'
    },
    user: {
        base: 'api/users/',
        list: 'api/users/',
        fetch: 'api/users/fetch/',
        fetchme: 'api/users/fetchme/',
        insert: 'api/users/insert/',
        bulkInsert: 'api/users/bulkInsert/',
        bulkDelete: 'api/users/bulkDelete/',
        bulkAccountStatusChange: 'api/users/bulkAccountStatusChange/',
        bulkUnlock: 'api/users/bulkUnlock/',
        update: 'api/users/update/',
        updateSelf: 'api/users/updateSelf/',
        delete: 'api/users/delete/',
        enable: 'api/users/enable/',
        disable: 'api/users/disable/',
        lock: 'api/users/lock/',
        unlock: 'api/users/unlock/',
        changePassword: 'api/users/changePassword/',
        changePasswordSelf: 'api/users/changePasswordSelf/',
    },
    group: {
        base: 'api/groups/',
        list: 'api/groups/',
        fetch: 'api/groups/fetch/',
        save: 'api/groups/save/',
        insert: 'api/groups/insert/',
        update: 'api/groups/update/',
        delete: 'api/groups/delete/',
    },
    log: {
        base: 'api/logs/',
        list: 'api/logs/',
        reset: 'api/logs/reset/',
        truncate: 'api/logs/truncate/'
    },
    domain: {
        base: "api/domain/",
        details: "api/domain/details/",
        zones: "api/domain/zones/",
        insert: "api/domain/insert/",
        delete: "api/domain/delete/",
    },
    dnsr: {
        insert: "api/record/insert/",
        update: "api/record/update/",
        delete: "api/record/delete/"
    },
    gpo: {
        list: 'api/gpo/',
    },
    settings: {
        base: "api/settings/",
        list: "api/settings/",
        save: "api/settings/save/",
        reset: "api/settings/reset/",
        test: "api/settings/test/"
    },
    ou: {
        base: "api/ou/",
        list: "api/ou/",
        insert: "api/ou/insert/",
        delete: "api/ou/delete/",
        filter: "api/ou/filter/",
        dirtree: "api/ou/dirtree/",
        move: "api/ou/move/",
        rename: "api/ou/rename/"
    },
    totp: {
        list: "api/totp/",
        create: "api/totp/create_device/",
        validate: "api/totp/validate_device/",
        delete: "api/totp/delete_device/",
    },
    test: {
        get: "api/test/",
        post: "api/test/post/",
        put: "api/test/put/",
        delete: "api/test/delete/",
        options: "api/test/options/"
    },
    liveness: {
        check: "api/liveness/check/"
    },
    debug: {
        list: "api/debug/",
        action: "api/debug/action/",
    },
}

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
            // erase local storage and go to Index Login.
            localStorage.removeItem('user_initials')
            localStorage.removeItem('user_fullname')
            if (router.app.$route.path != "/login")
                router.push('/login')
        }
        // If the request error code is 403 and the request hasn't been retried...
        if (error.response.status === 403 || error.response.status === 401 && !originalRequest._retry) {
            // Check flag for request being retried.
            originalRequest._retry = true;
            // Send refresh token request.
            let tokenRefreshAxios = axios.create(axios_opts)
            return tokenRefreshAxios.post(base_url+urls.auth.tokenRefresh)
            // then, if refresh request succeeds.
            .then(() => {
                var date = new Date()
                // 1) Set tokens on LocalStorage.
                localStorage.setItem('refreshClock', date.toISOString())
                // 2) Return re-sent request through new axios.
                return axios(originalRequest);
            // on refresh request error catch
            }).catch((e)=>{
                console.log(e)
                if (e?.response?.status != 200) {
                    // erase local storage and go to Index Login.
                    localStorage.removeItem('user_initials')
                    localStorage.removeItem('user_fullname')
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
