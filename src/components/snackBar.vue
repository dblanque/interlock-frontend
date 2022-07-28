<template>
    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :class="'mb-12 ' + snackbarClasses"
      :color="snackbarColor"
      :dark="!isThemeDark()" :light="isThemeDark()"
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
export default {
    props: {
        showSnackbar: Boolean,
        snackbarMessage: String,
        snackbarIcon: String,
        snackbarColor: String,
        snackbarClasses: String
    },
    methods: {
      // Check if theme is dark
      isThemeDark(){
          if (this.$vuetify.theme.dark == true) {
            return true
          }
          return false
      }
    },
}
</script>
