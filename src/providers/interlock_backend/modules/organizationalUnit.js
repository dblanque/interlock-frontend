import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    list: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.ou.list, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    }
}

export default actions