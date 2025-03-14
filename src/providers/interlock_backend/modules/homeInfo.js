// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/home.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	fetch: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.home.fetch).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	}
}

export default actions