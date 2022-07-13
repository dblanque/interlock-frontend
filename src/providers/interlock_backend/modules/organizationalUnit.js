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

    dirtree: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.ou.dirtree)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    }
}

export default actions