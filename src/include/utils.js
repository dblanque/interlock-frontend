export function dateFromFiletime(date) {
	if (!date) {
		return console.log("No date provided for dateFromFiletime")
	}
	if (date == 0)
		return date
	var result = new Date(date/1e4 - 1.16444736e13)
	return result;
}

export function truncateDate(d) {
	if (d === undefined || d === null || d === "")
		return ""
	return `${new Date(d).toISOString().replace("T", " ").substring(0, 19)} (UTC)`;
}

export function dateLdapToString(date) {
	if (!date) {
		return console.log("No date provided for dateFromFiletime")
	}
	if (date.slice(-1).toUpperCase() != 'Z') {
		console.log(date)
		console.log("Invalid timezone, must be Timezone Z (Zulu Time Zone, UTC/GMT)")
	}
	let dateString = date.toString()
	let year = dateString.substring(0,4)
	let month = dateString.substring(4,6)
	let day = dateString.substring(6,8)
	let hour = dateString.substring(8,10)
	let min = dateString.substring(10,12)
	let sec = dateString.substring(12,14)
	let result = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
	return result
}

export function objectRecursiveSearch(targetEntity, idToSearch, keyToSearch=undefined, childrenKey='children', searchResult=undefined){
	// console.log(targetEntity.distinguishedName)
	// If ID matches with current object
	if (idToSearch == targetEntity.id){
		if (targetEntity[keyToSearch] != undefined) {
			searchResult = targetEntity[keyToSearch]
			return searchResult
		}
		else {
			// console.log('Error: targetEntity key(' + keyToSearch + ') is undefined or its value is missing')
			searchResult = targetEntity
			return searchResult
		}
	}

	// If ID hasn't matched with this object,
	// then search in it's children if it has any.
	if (targetEntity[childrenKey] !== undefined && targetEntity[childrenKey] !== null && targetEntity[childrenKey].length != 0)
		// For each child do a recursive search calling this function
		targetEntity[childrenKey].forEach(child => {
			if (!searchResult) {
				searchResult = objectRecursiveSearch(child, idToSearch, keyToSearch, childrenKey, searchResult)
				if (searchResult && searchResult != false && searchResult != undefined){
					return searchResult
				}
			}
		})
	return searchResult
}

const asyncLocalStorage = {
	setItem(key, value) {
		return Promise.resolve().then(function () {
			localStorage.setItem(key, value);
		});
	},
	getItem(key) {
		return Promise.resolve().then(function () {
			return localStorage.getItem(key);
		});
	}
};

export function getDomainDetails(){
	let domainData = {}
	for (let i = 0; i < localStorage.length; i++){
		const key = localStorage.key(i)
		if (key.startsWith("ldap.")) {
			const val = localStorage.getItem(key)
			domainData[key.replace("ldap.", "")] = val
		}
	}
	return domainData
}

export function filterObject(obj, predicate) {
	return Object.keys(obj)
		.filter(key => predicate(obj[key]))
		.reduce((res, key) => ({ ...res, [key]: obj[key] }), {});
} 
