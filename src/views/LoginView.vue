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
                v-model="email"
                prepend-inner-icon="mdi-account"
                :disabled="submitted"
                validate-on-blur
                :rules="emailRules"
                :label="$t('section.login.account')"
                class="login-email-field login-field font-weight-bold my-2"
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
            <v-row
              class="justify-center red accent-3 ml-5 mr-5 rounded font-weight-bold"
              >{{ this.errorMsg }}</v-row
            >
            <!-- LOGIN BUTTONS -->
            <div>
            <v-row justify="space-around" class="pa-2 mt-4">
                <v-btn class="pa-0 ma-0 px-3 py-2 ma-3" v-on:click="gotoPasswRecovery" disabled>
                  <p class="text-md-body" style="margin-bottom: 0 !important;"> {{ $t("section.login.forgotMyPassword") }}</p>
                </v-btn>
                <v-btn
                  :loading="submitted"
                  :disabled="submitted || (this.email.length == 0 || this.password.length == 0) || !this.$refs.loginform.validate()"
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
  </v-container>
</template>

<script>
import User from '@/include/User'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue';

export default {
  name: "LoginView",
  components: {
    LanguageSelector,
    ThemeChanger
  },
  data() {
    return {
      valid: false,
      error: false,
      errorMsg: "",
      email: "",
      emailRules: [
        (v) => !!v || "E-mail " + this.$t("actions.isRequired"),
        (v) => /.+@.+/.test(v) || "E-mail " + this.$t("actions.invalid"),
      ],
      password: "",
      submitted: false,
      transitionInit: false,
      value: String,
    };
  },
  mounted() {
    this.transitionInit = true;
  },
  watch: {
    email: function () {
      this.error = false;
    },
    password: function () {
      this.error = false;
    },
  },
  methods: {
    async submit() {
      if (this.email == "" || this.password == "") {
        this.error = true;
        this.errorMsg = "";
      }
      else {
        this.submitted = true;
        this.errorMsg = "";
        var user = new User({})
        user.login(this.email, this.password)
        .then(response =>{
            console.log(response)
            if(response.data.access != undefined)
              this.$router.push("/home");
        })
        .catch((e) => {
          console.log(e)
          this.error = true;
          if(e.status == 401)
            this.errorMsg = this.$t('error.codes.auth.invalid_credentials')
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
