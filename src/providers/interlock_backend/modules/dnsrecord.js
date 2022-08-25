import interlock_backend from "@/../public/js/config.js";

const actions = {
    insert: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dnsr.insert, {record: data}).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    update: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.dnsr.update, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    delete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dnsr.delete, data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },
}

export default actions