<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LoginView.vue ------------------------------->
<template>
  <v-container class="login ma-0 pa-0" fluid fill-height>
    <v-card outlined 
    style="min-width:100%; border-radius: 0; border-left: 0; border-right:0;"
    class="py-4 px-6" :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
      <v-row class="mt-2" justify="center">
        <v-img contain max-width="450px" :aspect-ratio="14/3" :src="isThemeDark($vuetify) ? logoLight : logoDark"/>
      </v-row>
      <v-row class="pa-0 ma-0" justify="center">
        <v-form @submit.prevent
          id="login-form-container"
          v-model="valid"
          class=""
          color="transparent"
          ripple
          ref="loginform"
        >
          <v-col align="center">
            <!-- TITLE -->
            <!-- <v-row class="text-md-h6 justify-center my-1">
              <span class="">{{ $t("section.login.title") }}</span>
            </v-row> -->
            <v-row class="ma-0 pa-0 my-4" justify="center" align="center">
                <v-btn class="ma-0 pa-0 px-2" small outlined color="primary" @click="modeUser = !modeUser; username = ''; $refs.loginform.resetValidation()">
                  <span v-if="modeUser">
                    <v-icon class="mr-1">
                      mdi-email
                    </v-icon>
                    {{ $t("section.login.useEmail")}}
                  </span>
                  <span v-else>
                    <v-icon class="mr-1">
                      mdi-account
                    </v-icon>
                    {{ $t("section.login.useLDAPUser")}}
                  </span>
                </v-btn>
            </v-row>
            <!-- USER / EMAIL FIELD -->
            <v-row v-if="modeUser" justify="center" class="ma-0 pa-0">
              <v-text-field
                autofocus
                outlined
                dense
                v-model="username"
                :label="$t('section.login.account')"
                prepend-inner-icon="mdi-account"
                :disabled="submitted"
                validate-on-blur
                :rules="[this.fieldRules(username, 'ge_name', true)]"
                class="font-weight-bold"
                required
                @keydown.enter="submit()"
              ></v-text-field>
            </v-row>
            <v-row v-else justify="center" class="ma-0 pa-0">
              <v-text-field
                autofocus
                outlined
                dense
                v-model="username"
                :label="$t('attribute.email')"
                prepend-inner-icon="mdi-email"
                :disabled="submitted"
                validate-on-blur
                :rules="[this.fieldRules(username, 'ge_email', true)]"
                class="font-weight-bold"
                required
                @keydown.enter="submit()"
              ></v-text-field>
            </v-row>
            
            <!-- PASSWORD FIELD -->
            <v-row justify="center" class="ma-0 pa-0 mt-3">
              <v-text-field
                outlined
                dense
                :label="$t('attribute.users.password')"
                :type="value ? 'password' : 'text'"
                prepend-inner-icon="mdi-lock"
                v-model="password"
                :disabled="submitted"
                @keydown.enter="submit()"
                class="login-pwd-field login-field font-weight-bold mb-2"
                required
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
              ></v-text-field>
            </v-row>
            <v-row justify="center">
              <LanguageSelector class="font-weight-medium"/>
            </v-row>
            <v-row justify="center">
              <ThemeChanger class="font-weight-medium ma-6" :buttonIsSwitch="true"/>
            </v-row>
            <!-- ERROR MESSAGE -->
            <v-row justify="center">
              <v-expand-transition>
                <v-alert 
                  :type="loginForbiddenCount > 2 && error ? (loginForbiddenCount > 4 ? 'error' : 'warning') : 'info'" 
                  v-if="error == true && errorMsg != ''">
                  {{ this.errorMsg }}
                </v-alert>
              </v-expand-transition>
            </v-row
            >
            <!-- LOGIN BUTTONS -->
            <div>
            <v-row justify="space-around" class="pa-2 mt-4">
                <!-- <v-btn class="pa-0 ma-0 px-3 py-2 ma-3" v-on:click="gotoPasswRecovery" disabled>
                  <p class="text-md-body" style="margin-bottom: 0 !important;"> {{ $t("section.login.forgotMyPassword") }}</p>
                </v-btn> -->
                <v-btn
                  :loading="submitted"
                  :disabled="submitted || (this.username.length == 0 || this.password.length == 0) || !valid"
                  @click="submit"
                  class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3"
                >
                  {{ $t("section.login.loginBtn") }}
                </v-btn>
            </v-row>
            </div>
          </v-col>
        </v-form>
    </v-row>
    </v-card>

      <!-- Snackbar -->
      <v-snackbar
        v-model="logoutSnackbar"
        timeout="1500"
        class="mb-12"
        :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
      >
        {{ snackbarMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
            icon
            text
            v-bind="attrs"
            @click="logoutSnackbar = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
  </v-container>
</template>

<script>
import User from '@/include/User'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue';
import validationMixin from '@/plugins/mixin/validationMixin';
import utilsMixin from '@/plugins/mixin/utilsMixin';

export default {
  name: "LoginView",
  mixins: [ validationMixin, utilsMixin ],
  components: {
    LanguageSelector,
    ThemeChanger
  },
  async created() {
  },
  data() {
    return {
      logoLight: require('@/assets/interlock-logo-wt-dark.svg'),
      logoDark: require('@/assets/interlock-logo-wt-light.svg'),
      modeUser: true,
      loginForbiddenCount: 0,
      timeoutCounter: 30,
      timedOut: false,
      timeoutInterval: false,
      valid: false,
      error: false,
      errorMsg: "",
      username: "",
      password: "",
      submitted: false,
      logoutSnackbar: false,
      snackbarMessage: "",
      value: String,
    };
  },
  mounted() {
    var errInStorage = parseInt(localStorage.getItem('loginForbiddenCount'))
    var timedOutStorage = Boolean(localStorage.getItem('loginTimedOut'))
    var timeOutCounterStorage = parseInt(localStorage.getItem('loginTimeOutCounter'))
    if (Number.isInteger(errInStorage))
      this.loginForbiddenCount = errInStorage
    if (Number.isInteger(timeOutCounterStorage))
      this.timeoutCounter = timeOutCounterStorage
    if (timedOutStorage == true && this.timeoutCounter > 0)
      this.timedOut = timedOutStorage

    if (this.timedOut == true)
      this.setLoginTimeout()

    if (this.loginForbiddenCount > 0)
      this.error = true

    var userJustLoggedOut = localStorage.getItem('logoutMessage')
    if (userJustLoggedOut) {
      this.snackbarMessage = this.$t("misc.loggedOut").toUpperCase()
      this.logoutSnackbar = true;
      localStorage.removeItem('logoutMessage')
    }

    var token = localStorage.getItem('token')
    var admin_allowed = localStorage.getItem('admin_allowed')
    if (token && token != null && token != 'null') {
      if (admin_allowed == true)
        this.$router.push("/home")
      else
        this.$router.push("/enduser")
    }
  },
  watch: {
    validateForm(){
      if (!this.$refs.loginform.validate()) {
        this.valid = false
        return;
      }
      this.valid = true
      return;
    }
  },
  methods: {
    setLoginTimeout() {
        this.timedOut = true
        if (!this.timeoutCounter)
          this.timeoutCounter = 30
        localStorage.setItem('loginTimedOut', true)
        localStorage.setItem('loginTimeOutCounter', this.timeoutCounter)
        this.submitted = false
        this.valid = false
        this.error = true;
        this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
        this.timeoutInterval = setInterval(() => {
          if (this.timeoutCounter == 0) {
            this.clearLoginTimeout()
            this.valid = true
            this.errorMsg = this.$t("section.login.tryAgain")
            clearInterval(this.timeoutInterval)
            setTimeout(()=>{ this.error = false }, 2500)
          } 
          else {
            this.timeoutCounter -= 1
            this.valid = false
            localStorage.setItem('loginTimeOutCounter', this.timeoutCounter)
            if (this.timeoutCounter == 1)
              this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
            this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
          }
        }, 1000)
    },
    clearLoginTimeout() {
      localStorage.removeItem('loginForbiddenCount')
      localStorage.removeItem('loginTimedOut')
      localStorage.removeItem('loginTimeOutCounter')
      this.timedOut = false
      this.timeoutCounter = 30
      this.loginForbiddenCount = 0
    },
    async submit() {
      if (this.username == "" || this.password == "") {
        this.error = true;
        this.errorMsg = "";
      }
      else {
        this.submitted = true;
        var user = new User({})
        await user.login(this.username, this.password)
        .then(response =>{
          if(response.data.access != undefined) {
            this.error = false
            this.errorMsg = "";
            localStorage.removeItem('loginForbiddenCount')
            this.clearLoginTimeout()
            if (response.data.admin_allowed == true)
              this.$router.push("/home")
            else
              this.$router.push("/enduser")
          }
        })
        .catch(e => {
          console.log(e)
          this.submitted = false;
          this.error = true;
          var retriesLeft = 5 - this.loginForbiddenCount
          var retriesLeftMsg = this.$t("section.login.retriesLeft")
          if (retriesLeft == 1)
            retriesLeftMsg = this.$t("section.login.oneRetryLeft")
          if(e.status == 401){
            // Add error count to storage to avoid people reloading out of the timeout
            this.loginForbiddenCount += 1
            localStorage.setItem('loginForbiddenCount', this.loginForbiddenCount)
            if (retriesLeft > 0)
              this.errorMsg = this.$t('error.codes.auth.invalid_credentials')  + " (" + retriesLeft + " " + retriesLeftMsg + ")"
            else
              this.setLoginTimeout()
          }
          else {
            this.errorMsg = this.getMessageForCode(e);
          }
        });
      }
    },
    gotoPasswRecovery: function () {},
  },
};
</script>

<style>
.field-name{
  font-family: Montserrat;
  font-weight: 500;
}
</style>