// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/debug.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	// Lists valid Debugging Operations for LDAP Connector
    list: ()=>{
        return new Promise((resolve, reject) => {
            interlock_backend.request.get(interlock_backend.urls.debug.list).then(response => {
                resolve(response.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

export default actions