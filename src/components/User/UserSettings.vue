<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserSettings.vue ---------------------------->
<template>
    <v-card :loading="loading" class="pa-0 ma-0">
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                    User Preferences
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

		<v-row cols="12" class="ma-0 pa-0 mt-2" justify="center">
			<h3>
				{{ $t("ldap.attributes.username") }}
			</h3>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			{{ username }}
		</v-row>

		<v-row class="ma-0 pa-0" justify="center">
			<v-col cols="6" sm="10" md="8">
				<v-divider/>
			</v-col>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			<h4>
				{{ $t("ldap.attributes.name") }}
			</h4>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			{{ first_name + " " + last_name }}
		</v-row>

		<v-row class="ma-0 pa-0" justify="center">
			<v-col cols="6" sm="10" md="8">
				<v-divider/>
			</v-col>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			<h4>
				{{ $t("ldap.attributes.domain") }}
			</h4>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			{{ domain }}
		</v-row>

		<v-row class="ma-0 pa-0" justify="center">
			<v-col cols="6" sm="10" md="8">
				<v-divider/>
			</v-col>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			<h4>
				{{ $t("ldap.attributes.realm") }}
			</h4>
		</v-row>

		<v-row cols="12" class="ma-0 pa-0" justify="center">
			{{ realm }}
		</v-row>

		<v-divider class="mx-8 my-5"/>

		<v-row class="ma-0 pa-0" justify="center">
			<v-col cols="12">
				<h3>
				{{ $t('userAccountDropdown.two_factor_title') }}
				</h3>
			</v-col>
			<v-col cols="auto" class="ma-0 pa-0">
				<v-checkbox class="ma-0 pa-0"
					v-model="two_factor_auth"
					@change="toggleTwoFactor"
					:label="$t('userAccountDropdown.enable_two_factor')"/>
			</v-col>
			<v-col cols="12" v-if="totp_uri.length > 0 && two_factor_auth" 
				class="ma-0 pa-0" 
				justify="center">
				<QrcodeVue :value="totp_uri" :size="225" level="H" />
			</v-col>
		</v-row>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" 
			:justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'end'">
                <!-- Save User Changes Button -->
                <v-btn @click="closeDialog"
                :class="'ma-0 pa-0 pa-4 ma-1 text-normal bg-white bg-lig-25'" 
                rounded>
                    <v-icon class="mr-1">
                        mdi-close
                    </v-icon>
                    {{ $t("actions.close") }}
                </v-btn>
            </v-row>
        </v-card-actions>
	</v-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import TOTPDevice from '@/include/TOTP'
import utilsMixin from '@/plugins/mixin/utilsMixin'

export default {
	components: {
      QrcodeVue,
	},
    mixins: [ utilsMixin ],
	data(){
		return {
			loading: false,
			error: false,
			message: "",
			preferDarkMode: false,
			two_factor_auth: false,
			totp_uri: ""
		}
	},
	props: {
		username: String,
		first_name: String,
		last_name: String,
		domain: String,
		realm: String,
	},
	mounted() {
		this.loadSettings()
	},
	methods: {
		closeDialog(){
			this.$emit("close")
		},
		async loadSettings(){
			this.loading = true
			this.setTotp()
			this.preferDarkMode = this.isThemeDark(this.$vuetify)
			await new TOTPDevice({}).list()
			.then(response => {
				console.log(response)
				this.setTotp(response)
				this.loading = false
				this.error = false
			})
			.catch(e => {
				console.error(e)
				this.loading = false
				this.error = true
			})
		},
		setTotp(r=undefined){
			if (r)
				if (r.totp_uri) {
					this.totp_uri = r.totp_uri
					this.two_factor_auth = true
					return
				}
			this.totp_uri = ""
			this.two_factor_auth = false
		},
		async toggleTwoFactor(){
			this.loading = true
			if (this.two_factor_auth == true)
				await new TOTPDevice({}).create()
				.then(response => {
					console.log(response)
					this.setTotp(response)
					this.loading = false
					this.error = false
				})
				.catch(e => {
					console.error(e)
					this.loading = false
					this.error = true
				})
			else
				await new TOTPDevice({}).delete()
				.then(response => {
					console.log(response)
					this.totp_uri = ""
					this.two_factor_auth = false
					this.loading = false
					this.error = false
				})
				.catch(e => {
					console.error(e)
					this.loading = false
					this.error = true
				})
		}
	}
}
</script>