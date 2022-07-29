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
                localStorage.setItem("username", response.data.user.username)
                localStorage.setItem("first_name", response.data.user.first_name)
                localStorage.setItem("last_name", response.data.user.last_name)
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