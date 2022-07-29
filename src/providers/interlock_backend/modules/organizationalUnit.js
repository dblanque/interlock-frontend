import interlock_backend from "@/providers/interlock_backend/config";

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
            interlock_backend.request.post(interlock_backend.urls.ou.listfilter, objectArray)
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
    }
}

export default actions