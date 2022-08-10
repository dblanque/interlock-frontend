<template>
    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :class="'mb-12 ' + snackbarClasses"
      :color="snackbarColor"
      :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
      >
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    mixins: [ validationMixin ],
    props: {
        showSnackbar: Boolean,
        snackbarMessage: String,
        snackbarIcon: String,
        snackbarColor: String,
        snackbarClasses: String
    }
}
</script>
