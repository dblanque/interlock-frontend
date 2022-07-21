import backend from "@/providers/interlock_backend/config";

const calls = {
    login: (data)=>{
        return new Promise((resolve, reject) => {
            backend.request.post(backend.urls.auth.token, data).then(response => {
                if(!response || !response.data.access || response.status == 401) {
                    reject(response)
                    console.log('Authentication Rejected')
                }
                backend.request.defaults.headers.common.Authorization = 'Bearer ' + response.data.access

                var date = new Date()

                localStorage.setItem("token", 'Bearer ' + response.data.access)
                localStorage.setItem("refresh", 'Bearer ' + response.data.refresh)
                localStorage.setItem('refreshClock', date.toISOString())
                localStorage.setItem("username", data.username)
                resolve(response)
            }).catch((e) => {
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                console.log('Authentication Error')
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
