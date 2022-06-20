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
                localStorage.setItem("username", data.username)
                resolve(response)
            }).catch((e) => {
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                reject(e)
            })
        })
    },
    logout: () => {
        return new Promise(resolve => {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            localStorage.removeItem("username")
            localStorage.removeItem("first_name")
            localStorage.removeItem("last_name")
            resolve()
        })
    }
}

export default calls
