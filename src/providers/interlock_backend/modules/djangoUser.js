// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/djangoUser.js

import interlock_backend from "@/providers/interlock_backend/config";

const actions = {
	list: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.djangoUser.base).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	fetch: (id) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.djangoUser.detail.replace("{pk}", id)).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	insert: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.base, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	delete: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.delete(interlock_backend.urls.djangoUser.detail.replace("{pk}", data.id))
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},
	
	update: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.put(interlock_backend.urls.djangoUser.detail.replace("{pk}", data.id), data)
			.then(response => {
				resolve(response.data);
			}).catch((e) => reject(e))
		})
	},

	changeAccountStatus: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.changeAccountStatus.replace("{pk}", data.id), data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	changePassword: (data) => {
		let id = structuredClone(data.id)
		try {
			["id","username"].forEach(k => {
				if (k in data)
					delete data[k]
			});
		} catch (error) {
			console.error(error)
		}
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.changePassword.replace("{pk}", id), data)
				.then(response => {
					resolve(response.data);
				}).catch((e) => reject(e))
		})
	},

	selfFetch: () => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.user.selfFetch).then(response => {
				resolve(response.data)
			}).catch((e) => {
				reject(e)
			})
		})
	},

	selfInfo: () => {
		const authKeys = []
		return new Promise((resolve, reject) => {
			interlock_backend.request.get(interlock_backend.urls.user.selfInfo)
				.then(response => {
					for (const key in response.data.user) {
						if (authKeys.includes(key))
							localStorage.setItem(`auth.${key}`, response.data.user[key])
						else
							localStorage.setItem(`user.${key}`, response.data.user[key])
					}
					resolve(response);
				}).catch((e) => reject(e))
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
			interlock_backend.request.put(interlock_backend.urls.djangoUser.selfChangePassword, data)
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

	bulkChangeStatus: (data) => {
		return new Promise((resolve, reject) => {
			interlock_backend.request.post(interlock_backend.urls.djangoUser.bulkChangeStatus, data).then(response => {
				resolve(response)
			}).catch((e) => {
				reject(e)
			})
		})
	},
}

export default actions