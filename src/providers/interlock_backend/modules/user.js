// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/user.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    insert: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.insert, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    bulkInsert: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.bulkInsert, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    bulkDelete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.bulkDelete, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    enable: (username)=>{
        const data = {}
        data['username'] = username
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.enable, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    disable: (username)=>{
        const data = {}
        data['username'] = username
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.disable, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    lock: (username)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.lock, { username: username }).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    unlock: (username)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.unlock, { username: username }).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    getCurrentUserData: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user.base + 'me/')
            .then(response => {
                resolve(response);
                for (const key in response.data.user) {
                    localStorage.setItem(key, response.data.user[key])
                }
            }).catch((e) => reject(e))
        })
    },

    update: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.user.update, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },

    updateSelf: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.user.updateSelf, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },

    delete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.delete, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },

    changePassword: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.changePassword, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },

    changePasswordSelf: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.changePasswordSelf, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },

    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user.list).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    fetch: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.fetch, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    fetchme: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.fetchme, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions