<template>
  <v-container>
    <v-btn @click="back" flat><v-icon>keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
    <h1>{{ $t("settings.settings") }}</h1>
    <div v-if="!isAnonymous">
      <h3>{{ $t("settings.profile") }}</h3>
      <v-form ref="settings" @submit="save($event)">
        <v-layout row wrap>
          <v-flex xs12 sm6 md3>
            <v-text-field outline
              :label="$t('settings.displayName')"
              v-model="displayName"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field
              :label="$t('settings.email')"
              disabled
              outline
              v-model="email"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn type="submit">{{ $t('general.save') }}</v-btn>
      </v-form>
      <h3>{{ $t('settings.password') }}</h3>
      <v-form ref="password" @submit="updatePassword($event)">
        <v-layout row wrap>
          <v-flex xs12 sm6 md3>
            <v-text-field outline
              :label="$t('settings.newPassword')"
              type="password"
              v-model="newPassword"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field
              :label="$t('settings.newPasswordRepeat')"
              type="password"
              outline
              v-model="newPasswordRepeat"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn type="submit">{{ $t('general.save') }}</v-btn>
      </v-form>
      <h3>{{ $t('settings.language') }}</h3>
      <v-form ref="language" @submit="updateLanguage($event)">
        <v-layout row wrap>
          <v-flex xs12 sm6 md3>
            <v-select
              :items="supportedLanguages"
              item-text="value"
              item-value="key"
              v-model="language"
              :label="$t('settings.language')"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-btn type="submit">{{ $t('general.save') }}</v-btn>
      </v-form>
      <h3>{{ $t("settings.linkAccounts") }}</h3>
      <p>{{ $t("settings.linkAccountsDescription") }}</p>
      <v-btn type="button" v-if="!isGoogleLinked" @click="linkGoogle">{{ $t('settings.linkGoogle') }}</v-btn>
      <v-btn type="button" v-if="isGoogleLinked" color="#24919B" style="color:white;" @click="unlinkGoogle">{{ $t('settings.unlinkGoogle') }}</v-btn>
    </div>
    <div v-else>
      <h3>{{ $t("settings.migrateNewAccount") }}</h3>
      <p>{{ $t("settings.migrateNewAccountDescription") }}</p>
      <v-form ref="migrateAccount" @submit="migrateAccount($event)">
        <v-layout row wrap>
          <v-flex xs12 sm6 md3>
            <v-text-field
              :label="$t('settings.email')"
              type="email"
              outline
              v-model="migrateEmail"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field
              :label="$t('settings.password')"
              type="password"
              outline
              v-model="migratePassword"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn type="submit">{{ $t('settings.migrate') }}</v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { StoreMod } from "./../store";
import { getLanguage } from "./../translation";
import firebase from "firebase";
import cookies from 'js-cookie';

export default {
  name: "Settings",
  data(){
    return {
      email: firebase.auth().currentUser.email,
      displayName: firebase.auth().currentUser.displayName,
      newPassword: "",
      newPasswordRepeat: "",
      language: getLanguage(),

      migrateEmail: "",
      migratePassword: "",

      isGoogleLinked: false
    }
  },
  computed: {
    supportedLanguages(){
      return [
        {key: 'en', value: 'English'},
        {key: 'de', value: 'Deutsch'}
      ]
    },
    isAnonymous(){
      return firebase.auth().currentUser.isAnonymous;
    }
  },
  mounted(){
    var global_this = this;

    firebase.auth().currentUser.providerData.forEach(function(provider){
      switch(provider.providerId){
        case "google.com":
          global_this.isGoogleLinked = true;
          break;
      }
    });
  },
  methods: {
    back(){
      this.$router.replace("home");
    },
    save(event){
      event.preventDefault();

      var user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: this.displayName,
      }).then(function() {
        StoreMod.showNotification("notification.theProfileHasBeenSaved");
      }).catch(function() {
        StoreMod.showNotification("notification.thereWasAnErrorWhileSavingTheProfile");
      });
    },
    updatePassword(event){
      event.preventDefault();

      var user = firebase.auth().currentUser;

      if(this.newPassword === this.newPasswordRepeat){
        user.updatePassword(this.newPassword).then(function() {
          StoreMod.showNotification("notification.thePasswordHasBeenSet");
        }).catch(function(error) {
          StoreMod.showNotification(error);
        });
      } else {
        StoreMod.showNotification("notification.thePasswordsDoesNotMatch");
      }
    },
    updateLanguage(event){
      event.preventDefault();

      cookies.set("lang", this.language, { expires: 365 * 10 });

      StoreMod.showNotification("notification.theLanguageHasBeenUpdated");
      setTimeout(function(){
        window.location.reload(); //Refresh the page
      }, 2000);
    },
    migrateAccount(event){
      event.preventDefault();
      var global_this = this;
      if(this.isAnonymous){
        var credential = firebase.auth.EmailAuthProvider.credential(this.migrateEmail, this.migratePassword);
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function() {
          StoreMod.showNotification(global_this.$t("notification.migrationSuccessful"));
          setTimeout(function(){
            location.reload();
          }, 1500);
        }, function(err) {
          StoreMod.showNotification(global_this.$t("notification.thereWasAnError") + ": " + err.message);
        });
      }
    },
    linkGoogle(){
      var global_this = this;

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {

        //Search first for the Google provider
        result.user.providerData.forEach(function(provider){
          if(provider.providerId === "google.com"){

            //Store the Gmail address in to the separate collection
            var gmail = provider.email;
            firebase.firestore().collection("google_users").doc(gmail).set({
              uid: result.user.uid
            }).then(function(){
              StoreMod.showNotification(global_this.$t("notification.theAccountHasBeenLinked"));
              global_this.isGoogleLinked = true;
            });
          }
        });
      }).catch(function(error) {
        StoreMod.showNotification(global_this.$t("notification.thereWasAnError") + ": " + error.message);
      });
    },
    unlinkGoogle(){
      var global_this = this;

      firebase.auth().currentUser.unlink("google.com").then(function() {
        StoreMod.showNotification(global_this.$t("notification.theAccountHasBeenUnlinked"));
        global_this.isGoogleLinked = false;
      }).catch(function(error) {
        StoreMod.showNotification(global_this.$t("notification.thereWasAnError") + ": " + error.message);
      });
    }
  }
}
</script>

<style>
div.v-text-field {
  margin: 10px !important;
}

h3{
  margin-top:30px;
}
</style>
