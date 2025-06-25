<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: AboutDialog.vue ----------------------------->
<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="pa-0 ma-0 ma-2 ml-3">
					{{ $t('contrib.title') }}
				</h3>
				<v-btn
					icon color="red" class="ma-2" rounded @click="closeDialog">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>
		<v-card-text class="mt-4 pa-2 pt-0 font-weight-medium">
			<!-- Main MSG -->
			<v-row class="my-2 mx-1">
				<span v-html="$t('contrib.mainMsg')" />
			</v-row>
			<h3 class="mt-3 mb-1">
				{{ $t('contrib.subTitle') }}
			</h3>
			<v-row class="my-2 mx-1" justify="start">
				<ul class="contrib-list">
					<li v-for="value, key in contributors">
						{{ value.display_name }} -
						<a :href="value.website"
							target="_blank">({{ value.website }})</a>
						<ul>
							<li v-for="k in value.items" :key="k">
								<span v-html="$t(k)" />
							</li>
						</ul>
					</li>
				</ul>
			</v-row>

			<v-row class="ma-0 pa-0" justify="center">
				{{ $t('misc.version') + ": " + version }}
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import { getRuntimeConfig } from "@/providers/interlock_backend/config";

export default {
	name: 'AboutDialog',
	data() {
		return {
			version: {},
			contributors: {
				"jblanque":{
					"display_name":"Javier Blanqué",
					"website":"https://javier.blanque.com.ar",
					"items":["contrib.jblanque"],
				},
				"mvilche":{
					"display_name":"Martín Vilche",
					"website":"https://martinvsolutions.com",
					"items":[
						"contrib.mvilche.1",
						"contrib.mvilche.2",
						"contrib.mvilche.3",
					],
				},
				"bblanque":{
					"display_name":"Brian Blanqué",
					"website":"https://brian.blanque.com.ar",
					"items":["contrib.bblanque"],
				},
				"etianen":{
					"display_name":"Dave Hall",
					"website":"https://github.com/etianen/django-python3-ldap",
					"items":["contrib.etianen"],
				},
				"dirkjanm":{
					"display_name":"Dirk-jan M.",
					"website":"https://github.com/dirkjanm/krbrelayx",
					"items":["contrib.dirkjanm"],
				},
				"juanifioren":{
					"display_name":"Juan Ignacio Fiorentino",
					"website":"https://github.com/juanifioren/django-oidc-provider",
					"items":["contrib.juanifioren"],
				},
			}
		}
	},
	created() {
		this.getLocalConfig()
	},
	methods: {
		async getLocalConfig() {
			this.version = await getRuntimeConfig()
				.then(function (json) {
					return json.version
				})
		},
		closeDialog() {
			this.$emit('close')
		}
	},
}
</script>

<style>
.contrib-list li {
	text-align: left;
}
</style>