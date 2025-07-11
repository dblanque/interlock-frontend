// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/application.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	list: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.application.base).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	insert: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.application.base, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	fetch: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.application.detail.replace("{pk}", id)).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	update: (data) => {
		let id = data.id
		return new Promise((resolve, reject) => {
			interlock_backend.request.put(interlock_backend.urls.application.detail.replace("{pk}", id), data).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.delete(interlock_backend.urls.application.detail.replace("{pk}", id))
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	oidc_well_known: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.application.oidc_well_known).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},
}

export default actions