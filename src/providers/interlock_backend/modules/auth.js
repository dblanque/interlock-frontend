// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/auth.js

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
                localStorage.setItem("username", response.data.username)
                localStorage.setItem("admin_allowed", response.data.admin_allowed)
                resolve(response)
            }).catch((e) => {
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem('admin_allowed')
                console.log('Authentication Error')
                reject(e)
            })
        })
    },
    logout: () => {
        return new Promise(resolve => {
            backend.request.get(backend.urls.auth.logout).then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem("username")
                localStorage.removeItem("first_name")
                localStorage.removeItem("last_name")
                localStorage.removeItem("email")
                localStorage.removeItem('admin_allowed')
                resolve()
            }).catch(error => {
                console.log(error)
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem("username")
                localStorage.removeItem("first_name")
                localStorage.removeItem("last_name")
                localStorage.removeItem("email")
                localStorage.removeItem('admin_allowed')
                resolve()
            })
        })
    }
}

export default calls
