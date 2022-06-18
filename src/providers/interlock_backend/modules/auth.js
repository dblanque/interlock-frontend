import backend from "@/providers/interlock_backend/config";

const calls = {
    login: (data)=>{
        return new Promise((resolve, reject) => {
            backend.request.post(backend.urls.auth.token, data).then(response => {
                if(!response || !response.data.access)
                        reject(response)
                backend.request.defaults.headers.common.Authorization = 'Bearer ' + response.data.access
                localStorage.setItem("token", 'Bearer ' + response.data.access)
                localStorage.setItem("refresh", 'Bearer ' + response.data.refresh)
                localStorage.setItem("user_email", data.email)
                resolve(response)
            }).catch((e) => {
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem('user_initials')
                localStorage.removeItem('user_fullname')
                reject(e)
            })
        })
    },
    logout: () => {
        return new Promise(resolve => {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            localStorage.removeItem('user_initials')
            localStorage.removeItem('user_fullname')
            resolve()
        })
    }
}

export default calls
