// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/organizationalUnit.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    list: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.dirtree.organizational_units)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    dirtree: (filter) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.dirtree.base, { filter: filter })
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    move: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dirtree.move, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    rename: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dirtree.rename, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    insert: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dirtree.base, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    delete: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.patch(interlock_backend.urls.dirtree.base, data).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },
}

export default actions