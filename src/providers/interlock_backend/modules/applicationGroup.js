// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/group.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	create_info: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.applicationGroup.create_info).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	insert: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.applicationGroup.base, data)
				.then(response => {
					resolve(response);
				}).catch((e) => reject(e))
		})
	},

	update: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.put(interlock_backend.urls.applicationGroup.detail.replace("{pk}", data.id), data)
				.then(response => {
					resolve(response);
				}).catch((e) => reject(e))
		})
	},

	list: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.applicationGroup.base).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	fetch: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.applicationGroup.detail.replace("{pk}", id)).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.delete(interlock_backend.urls.applicationGroup.detail.replace("{pk}", id)).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	change_status: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.patch(interlock_backend.urls.applicationGroup.change_status.replace("{pk}", data.id), {enabled: data.enabled}).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	}
}

export default actions