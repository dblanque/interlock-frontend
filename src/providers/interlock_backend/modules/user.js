import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    insert: (data)=>{
        var addUrl = ""
        switch(data.role){
            case 'administrator': addUrl = "create_admin/"; break;
            case 'manager': addUrl = "create_manager/"; break;
            case 'analyst': addUrl = "create_analyst/"; break;
            case 'customer': addUrl = "create_customer/"; break;
        }
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user + addUrl, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },
    update: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.user + data.id + '/', data)
            .then(response => {
                resolve(response.data);
            }).catch((e) => reject(e))
        })
    },
    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user, null).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
    getByEmail: (email)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user+'?email='+email).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },
    getById: (id)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user + id + '/')
            .then(response => {
                resolve(response.data.user)
            }).catch((e) => reject(e))
        })
    },
    filter: (parameters)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user+'filter/', parameters).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
                console.log(e);
            })
        })
    }
}

export default actions