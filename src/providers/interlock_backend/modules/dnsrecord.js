import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    details: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.domain.details)
            .then(response => {
                resolve(response);
                localStorage.setItem("domain", response.data.details.name)
                localStorage.setItem("realm", response.data.details.realm)
                localStorage.setItem("basedn", response.data.details.basedn)
            }).catch((e) => reject(e))
        })
    },

    zones: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.domain.zones, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions