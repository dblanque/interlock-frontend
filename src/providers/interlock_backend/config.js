import axios from "axios";
import router from "@/router/index.js"
// import localSettings from "@/providers/interlock_backend/local_settings.js";

// Sets content type to json utf-8 default.
axios.defaults.headers.common["content-type"] = "application/json;charset=utf-8";

// Default back-end provider url.
// ! PLEASE INCLUDE '/' at the end of URL.
// const base_url =  "https://" + localSettings.backend_url + "/";
const base_url =  "http://127.0.0.1:8000/";

// Axios Instance.
const request = axios.create({
    baseURL: base_url
});

// Sets token into request common again after page reload.
var auth = localStorage.getItem('token');
if(auth != null && auth != undefined && auth.length > 0)
    request.defaults.headers.common.Authorization = auth;

// LIST OF URL PATTERNS.
const urls = {
    auth: {
        token: 'api/token/',
        tokenRefresh: 'api/token/refresh/'
    },
    user: {
        base: 'api/users/',
        list: 'api/users/',
        fetch: 'api/users/fetch/',
        fetchme: 'api/users/fetchme/',
        insert: 'api/users/insert/',
        update: 'api/users/update/',
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
        delete: 'api/groups/delete/',
    },
    domain: {
        base: "api/domain/",
        details: "api/domain/details/"
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
        filter: "api/ou/filter/",
        dirtree: "api/ou/dirtree/",
        move: "api/ou/move/"
    }
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
        // If the request error code is 403 and the request hasn't been retried...
        if (error.response.status === 403 || error.response.status === 401 && !originalRequest._retry) {
            // Obtain Refresh token saved.
            var refreshToken = localStorage.getItem('refresh')
            // If there's no refresh token, erase local storage and go to Index Login.
            if(refreshToken == null || refreshToken == undefined){
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem('user_initials')
                localStorage.removeItem('user_fullname')
                if (router.app._route.path != "/login")
                    router.push('/login')
                return error.response
            }
            // Else, if there's refresh token...
            else {
                // Check flag for request being retried.
                originalRequest._retry = true;
                // Send refresh token request.
                return axios.post(base_url+urls.auth.tokenRefresh,{refresh: refreshToken.slice(7)})
                // then, if refresh request succeeds.
                .then(res => {
                    if (res.data.access) {
                        var date = new Date()
                        // 1) Set tokens on LocalStorage.
                        localStorage.setItem('token', 'Bearer ' + res.data.access)
                        localStorage.setItem('refresh', 'Bearer ' + res.data.refresh)
                        localStorage.setItem('refreshClock', date.toISOString())
                        // 2) Change Authorization header.
                        originalRequest.headers.Authorization = 'Bearer ' + res.data.access;
                        request.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access;
                        // 3) Return re-sent request through new axios.
                        return axios(originalRequest);
                    }
                    else throw "No token recieved.";
                // on refresh request error catch
                }).catch((e)=>{
                    console.log(e)
                    // erase local storage and go to Index Login.
                    localStorage.removeItem('token')
                    localStorage.removeItem('refresh')
                    localStorage.removeItem('user_initials')
                    localStorage.removeItem('user_fullname')
                    if (router.app._route.path != "/login")
                        router.push('/login')
                    return error.response
                })
            }
        // Else, if the error is other than Unauthorized...
        }else
            // Return error response.
            return Promise.reject(error)
    }
)// End of Interceptor.

export default {
    urls: urls,
    request: request
};
