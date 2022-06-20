import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    details: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.domain.details + '', data)
            .then(response => {
                resolve(response);
                localStorage.setItem("domain", response.data.domain)
                localStorage.setItem("realm", response.data.realm)
            }).catch((e) => reject(e))
        })
    }
}

export default actions