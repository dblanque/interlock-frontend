// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/totp.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {

    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.totp.list).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    create: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.totp.create).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    validate: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.totp.validate, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    delete: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.delete(interlock_backend.urls.totp.delete).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions