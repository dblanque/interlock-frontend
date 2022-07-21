import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.list)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    reset: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.reset)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    save: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.save, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    }
}

export default actions