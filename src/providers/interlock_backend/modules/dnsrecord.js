// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/dnsrecord.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    insert: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.dnsr.base, { record: data }).then(response => {
                resolve(response)
            }).catch((e) => {
                reject(e)
            })
        })
    },

    update: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.put(interlock_backend.urls.dnsr.base, data)
                .then(response => {
                    resolve(response);
                }).catch((e) => reject(e))
        })
    },

    delete: (data) => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.patch(interlock_backend.urls.dnsr.base, data)
                .then(response => {
                    resolve(response.data);
                }).catch((e) => reject(e))
        })
    },
}

export default actions