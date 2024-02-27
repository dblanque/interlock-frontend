<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserBulkEdit.vue ------------------------------>
<template>
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('section.users.bulkEdit.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>
	</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	mixins: [ utilsMixin, validationMixin ],
	props: {
        viewKey: String,
		refreshLoading: Boolean
	},
	data() {
		return {
		}
	},
	methods: {
        async closeDialog(editConfirm=false) {
            if (editConfirm == true) {
				await new User({}).bulkEdit(this.userObjectList)
				.then(() => {})
				.catch(error => { console.error(error) })
                this.$emit('closeDialog', this.viewKey, true);
            } else
                this.$emit('closeDialog', this.viewKey);
        },
	}
}
</script>
