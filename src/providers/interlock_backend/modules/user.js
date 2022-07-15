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
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.enable, { username: username }).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    disable: (username)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.disable, { username: username }).then(response => {
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

    getCurrentUserData: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user.base + 'me', data)
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
    list: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.user.list, data).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    },
    fetch: (username)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.user.fetch, username).then(response => {
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