// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/domain.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    details: ()=>{
        const REMOVE_KEYS_IF_MISSING = [
            "debug"
        ]
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.domain.base)
            .then(response => {
                resolve(response);
                for (const key in response.data.details)
                    localStorage.setItem(`ldap.${key}`, response.data.details[key])
                REMOVE_KEYS_IF_MISSING.forEach(k => {
                    if (!(k in response.data.details))
                        localStorage.removeItem(`ldap.${k}`)
                })
            }).catch((e) => reject(e))
        })
    },

    zones: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.domain.zone, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    insert: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.domain.base, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    delete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.patch(interlock_backend.urls.domain.base, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions