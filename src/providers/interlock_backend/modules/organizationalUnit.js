import interlock_backend from "@/../public/js/config.js";

const actions = {
    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.ou.list)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    filter: (objectArray)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.filter, objectArray)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    dirtree: (filter)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.dirtree, {filter: filter})
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    move: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.move, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    rename: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.rename, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    insert: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.insert, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    delete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.ou.delete, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions