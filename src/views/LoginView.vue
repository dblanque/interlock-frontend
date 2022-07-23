<template>
  <v-container class="login ma-0 pa-0" fluid fill-height>
    <v-card style="min-width:100%;" flat class="py-4 px-6" :dark="isThemeDark()" :light="!isThemeDark()">
      <h1>{{ $t("indexTitle") }}</h1>
      <v-row class="pa-0 ma-0" justify="center">
        <v-form
          id="login-form-container"
          v-model="valid"
          class=""
          color="transparent"
          ripple
          ref="loginform"
        >
          <v-col align="center">
            <!-- TITLE -->
            <v-row class="text-md-h6 justify-center">
              <span class="">{{ $t("section.login.title") }}</span>
            </v-row>
            <!-- USER / EMAIL FIELD -->
            <v-row justify="center">
              <v-text-field
                v-model="username"
                prepend-inner-icon="mdi-account"
                :disabled="submitted"
                validate-on-blur
                :rules="[this.fieldRules(username, 'ge_name', true)]"
                :label="$t('section.login.account')"
                class="font-weight-bold my-2"
                required
                @keydown.enter="submit()"
              ></v-text-field>
            </v-row>
            <!-- PASSWORD FIELD -->
            <v-row justify="center">
              <v-text-field
                :type="value ? 'password' : 'text'"
                prepend-inner-icon="mdi-lock"
                v-model="password"
                :disabled="submitted"
                :label="$t('attribute.users.password')"
                @keydown.enter="submit()"
                class="login-pwd-field login-field font-weight-bold my-2"
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
                <v-alert :type="loginForbiddenCount > 2 && error ? (loginForbiddenCount > 4 ? 'error' : 'warning') : 'info'" v-if="error == true && errorMsg != ''">
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
        :dark="!isThemeDark()" :light="isThemeDark()"
      >
        {{ snackbarMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
            icon
            text
            v-bind="attrs"
            @click="snackbar = false"
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

export default {
  name: "LoginView",
  mixins: [ validationMixin ],
  components: {
    LanguageSelector,
    ThemeChanger
  },
  async created() {
  },
  data() {
    return {
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
      this.snackbarMessage = this.$t("misc.loggedOut")
      this.logoutSnackbar = true;
      localStorage.removeItem('logoutMessage')
    }

    var token = localStorage.getItem('token')
    if (token && token != null && token != 'null') {
      this.$router.push("/home")
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
            this.$router.push("/home");
          }
        })
        .catch((e) => {
          console.log(e)
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
          else
            this.errorMsg = this.getMessageForCode(e.data.code);
          this.submitted = false;
        });
      }
    },
    gotoPasswRecovery: function () {},
    isThemeDark(){
        if (this.$vuetify.theme.dark == true) {
          return true
        }
        return false
    },
  },
};
</script>
