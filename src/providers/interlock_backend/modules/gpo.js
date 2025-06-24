// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/gpo.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
    list: () => {
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.gpo.list)
                .then(response => {
                    resolve(response);
                })
                .catch((e) => reject(e))
        })
    },
}

export default actions