// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: modules/auth.js

import backend from "@/providers/interlock_backend/config";

const calls = {
	login: (data) => {
		return new Promise((resolve, reject) => {
			backend.request.post(backend.urls.auth.token, data).then(response => {
				if (!response || response.status == 401) {
					reject(response)
					console.log('Authentication Rejected')
				}
				let date = new Date()

				localStorage.setItem("user.logged_in", true)
				localStorage.setItem('auth.refresh_clock', date)
				localStorage.setItem('auth.access_expire', response.data.access_expire)
				localStorage.setItem('auth.refresh_expire', response.data.refresh_expire)
				localStorage.setItem("user.username", response.data.username)
				localStorage.setItem("user.user_type", response.data.user_type)
				if (Object.keys(response.data).includes('admin_allowed'))
					localStorage.setItem("user.admin_allowed", response.data.admin_allowed)
				else
					localStorage.removeItem("user.admin_allowed")
				resolve(response)
			}).catch((e) => {
				localStorage.setItem("user.logged_in", false)
				localStorage.removeItem('user.admin_allowed')
				// if (e?.response?.data?.code != "otp_required"){
				//     console.log('Authentication Error')
				// }
				reject(e)
			})
		})
	},
	logout: (timeout = false) => {
		const removeKeys = [
			"auth.refresh_clock",
			"user.username",
			"user.first_name",
			"user.last_name",
			"user.user_type",
			"user.email",
			"user.admin_allowed",
			"user.logged_in",
		]
		if (!timeout)
			return new Promise(resolve => {
				backend.request.post(backend.urls.auth.logout).then(() => {
					removeKeys.forEach(element => {
						localStorage.removeItem(element)
					});
					resolve()
				}).catch(error => {
					console.error(error)
					removeKeys.forEach(element => {
						localStorage.removeItem(element)
					});
					resolve()
				})
			})
		else {
			removeKeys.forEach(element => {
				localStorage.removeItem(element)
			});
		}
	}
}

export default calls
