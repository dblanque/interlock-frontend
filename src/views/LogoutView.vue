<template>
	<v-container id="login-container"
		class="ma-0 pa-0 justify-center align-items-center"
		fluid
		fill-height>
	</v-container>
</template>

<script>
import User from '@/include/User.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: 'LogoutView',
  mixins: [utilsMixin],
	async mounted() {
		this.isThemeDark(this.$vuetify);
		await new User({}).logout()
			.then(response => {
				localStorage.setItem("auth.logoutMessage", true);
				if (response?.status !== 401)
					this.$router.push("/login");
			})
			.catch(e => {
				console.error(e)
				this.$router.push("/login");
			});
	},
};
</script>