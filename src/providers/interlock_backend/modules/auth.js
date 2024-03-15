// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/auth.js

import backend from "@/providers/interlock_backend/config";

const calls = {
    login: (data)=>{
        return new Promise((resolve, reject) => {
            backend.request.post(backend.urls.auth.token, data).then(response => {
                if(!response || response.status == 401) {
                    reject(response)
                    console.log('Authentication Rejected')
                }
                var date = new Date()

                localStorage.setItem('auth.refreshClock', date.toISOString())
                localStorage.setItem("user.username", response.data.username)
                if (Object.keys(response.data).includes('admin_allowed'))
                    localStorage.setItem("user.admin_allowed", response.data.admin_allowed)
                else
                    localStorage.removeItem("user.admin_allowed")
                resolve(response)
            }).catch((e) => {
                localStorage.removeItem('user.admin_allowed')
                // if (e?.response?.data?.code != "otp_required"){
                //     console.log('Authentication Error')
                // }
                reject(e)
            })
        })
    },
    logout: (timeout=false) => {
        const removeKeys = [
            "refreshClock",
            "username",
            "first_name",
            "last_name",
            "email",
            "admin_allowed"
        ]
        if (!timeout)
            return new Promise(resolve => {
                backend.request.post(backend.urls.auth.logout).then(() => {
                    removeKeys.forEach(element => {
                        localStorage.removeItem(element)
                    });
                    resolve()
                }).catch(error => {
                    console.error(error)
                    removeKeys.forEach(element => {
                        localStorage.removeItem(element)
                    });
                    resolve()
                })
            })
        else {
            removeKeys.forEach(element => {
                localStorage.removeItem(element)
            });
        }
    }
}

export default calls
