<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: DirtreeOUList.vue --------------------------->
<template>
	<div>
		<v-progress-linear v-if="showLoadingBar" :indeterminate="loading"
			:color="loading ? 'primary' : 'secondary'" />
		<v-expand-transition>
			<v-treeview v-if="this.ouList.length > 0"
				:items="this.ouList"
				:active.sync="activeObject"
				dense
				hoverable
				activatable
				@update:active="updateObjectDestination">
				<template v-slot:prepend="{ item, open }">
					<v-icon v-if="item.builtin == true && item.type != 'container'">
						mdi-hammer
					</v-icon>
					<v-icon v-else-if="item.type == 'container'">
						mdi-archive
					</v-icon>
					<v-icon v-else-if="item.type == 'organizational-unit'">
						{{ open ? 'mdi-folder-open' : 'mdi-folder' }}
					</v-icon>
					<v-icon v-else>
						mdi-group
					</v-icon>
				</template>
				<template v-slot:label="{ item }">
					<v-row align="start">
						<v-col cols="11" md="auto">
							{{ item.name }}
						</v-col>
					</v-row>
				</template>
			</v-treeview>
		</v-expand-transition>
	</div>
</template>

<script>
import OrganizationalUnit from '@/include/OrganizationalUnit.js'
import { objectRecursiveSearch } from '@/include/utils.js';

export default {
	name: 'DirtreeOUList',
	data() {
		return {
			activeObject: [],
			ouList: [],
			objectDestination: "",
			loading: false,
			error: false
		}
	},
	props: {
		baseDn: String,
		excludeObjects: String || Array, // This is to exclude self when moving an OU
		showLoadingBar: {
			type: Boolean,
			default: true
		},
		fetchOnCreated: {
			type: Boolean,
			default: true
		}
	},
	created() {
		if (this.fetchOnCreated)
			this.fetchOUs()
	},
	methods: {
		emitDestination() {
			this.$emit('selectedDestination', this.objectDestination)
		},
		clearList() {
			this.ouList = []
		},
		updateObjectDestination(itemID) {
			if (!itemID || itemID.length == 0) {
				this.objectDestination = "CN=Users," + this.baseDn
				// console.log('this.objectDestination was reset to ' + this.objectDestination)
				return this.objectDestination
			}
			var itemToUpdate = this.ouList.find(ou => ou.id == itemID)
			var searchResult
			if (itemToUpdate == undefined) {
				this.ouList.forEach(ou => {
					if (!searchResult) {
						searchResult = objectRecursiveSearch(ou, parseInt(itemID), "distinguished_name")
						this.objectDestination = searchResult
					}
				})
			} else if (itemToUpdate.id == itemID)
				this.objectDestination = itemToUpdate.distinguished_name

			this.emitDestination()
		},
		async fetchOUs(excludeDict = undefined) {
			this.loading = true
			this.error = false
			this.activeObject = []
			if (excludeDict)
				await new OrganizationalUnit({}).dirtree(excludeDict)
					.then(response => {
						this.ouList = response.data.ldapObjectList
						this.loading = false
						return response
					})
					.catch(error => {
						this.loading = false
						this.error = true
						console.error(error)
						return error
					})
			else
				await new OrganizationalUnit({}).list()
					.then(response => {
						this.ouList = response.data.ldapObjectList
						this.loading = false
						return response
					})
					.catch(error => {
						this.loading = false
						this.error = true
						console.error(error)
						return error
					})
		},
	},
}
</script>