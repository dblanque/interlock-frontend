// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/djangoUser.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	list: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.djangoUser.list).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	fetch: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.fetch.replace("{pk}", id)).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	insert: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.insert, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.delete.replace("{pk}", id))
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	enable: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.changeAccountStatus.replace("{pk}", id)).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	disable: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.changeAccountStatus.replace("{pk}", id)).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	update: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.put(interlock_backend.urls.djangoUser.update.replace("{pk}", data.id), data)
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	changePassword: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.changePassword.replace("{pk}", data.id))
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	selfFetch: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.djangoUser.selfFetch).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	selfUpdate: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.put(interlock_backend.urls.djangoUser.selfUpdate, data)
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	selfChangePassword: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.selfChangePassword, data)
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	bulkInsert: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.bulkInsert, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	bulkDelete: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.bulkDelete, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	bulkUpdate: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.bulkUpdate, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	bulkStatusChange: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.bulkStatusChange, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},
}

export default actions