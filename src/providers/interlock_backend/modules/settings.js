// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/settings.js

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

    fetch: (presetId)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.settings.fetch + `${presetId}/`)
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

    test: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.test, data)
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
    },

    preset_create: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_create, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    preset_rename: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_rename, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    preset_delete: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_delete, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    },

    preset_enable: (data)=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.post(interlock_backend.urls.settings.preset_enable, data)
            .then(response => {
                resolve(response);
            }).catch((e) => reject(e))
        })
    }
}

export default actions