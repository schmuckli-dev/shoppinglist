<template>
  <v-container>
    <v-layout row wrap>
      <v-flex order-xs2 order-sm1 xs12 sm6>
        <v-form @submit="register($event)" ref="formRegister" style="margin-left:auto;margin-right:auto;">
          <v-card class="form_card">
            <div style="width:100%;">
              <h2>{{ $t('login.register') }}</h2>
              <br>
              <v-text-field outline
                v-model="Remail"
                :label="$t('settings.email')" required
              ></v-text-field>
              <v-text-field outline
                v-model="Rpassword"
                type="password"
                :label="$t('settings.password')" required
              ></v-text-field>
              <v-text-field outline
                v-model="RpasswordRepeat"
                type="password"
                :label="$t('login.passwordRepeat')" required
              ></v-text-field>
            </div>
            <v-card-actions right>
              <v-btn type="submit" flat>{{ $t('login.register') }}</v-btn>
              <v-btn type="button" @click="goToLogin" flat>{{ $t('login.alreadyHaveAnAccount') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
      <v-flex order-xs1 order-sm2 xs12 sm6 pull-left>
        <FeatureCard />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { StoreMod } from "../store.js";
import FeatureCard from "../components/FeatureCard";

export default {
  name: "Login",
  data(){
    return {
      Remail: "",
      Rpassword: "",
      RpasswordRepeat: ""
    }
  },
  components: {
    FeatureCard
  },
  methods: {
    register(event){
      event.preventDefault();

      var global_this = this;
      if(this.$refs.formRegister.validate()){
        if (this.Rpassword === this.RpasswordRepeat) {
          if(navigator.onLine){
            window.sCAuth.registerEmailPassword(this.Remail.trim(), this.Rpassword, window.navigator.language.substring(0, 2)).then(
              function(response){
                if (response.isOK) {
                  global_this.$router.replace('login');
                  StoreMod.showNotification("notification.registrationSuccessful");
                } else {
                  StoreMod.showNotification(response.message)
                }
              }
            ).catch(function(error){
              StoreMod.showNotification(error.message);
            });
          } else {
            StoreMod.showNotification("notification.cantRegisterWhileOffline");
          }
        } else {
          StoreMod.showNotification("notification.thePasswordsDoesNotMatch");
        }
      }
    },
    goToLogin(){
      this.$router.replace("login");
    }
  }
}
</script>
<style>
h2 {
  margin: 10px 10px 0 10px;
}
</style>
