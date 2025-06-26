// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/oidc.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	consent: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.oidc.consent, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	reject: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.oidc.reject, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	}
}

export default actions