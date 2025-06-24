// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/settings.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    list: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.base)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    fetch: (presetId) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.detail.replace("{pk}", presetId))
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    reset: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.reset)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    test: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.test, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    save: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.save, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    sync_users: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.sync_users)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    prune_users: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.prune_users)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    purge_users: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.purge_users)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    preset_create: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.base, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    preset_rename: (data) => {
        let id = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_rename.replace("{pk}", id), data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    preset_delete: (data) => {
        let id = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            interlock_backend.request.delete(interlock_backend.urls.settings.detail.replace("{pk}", id), data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    preset_enable: (data) => {
        let id = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_enable.replace("{pk}", id), data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    }
}

export default actions