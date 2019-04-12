import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './plugins/vuetify'
import { translations, getLanguage } from './translation.js';
import App from './App.vue'
import router from './router';
import firebase from "firebase";

Vue.config.productionTip = false

Vue.use(VueI18n);

let app = '';

firebase.initializeApp({
  apiKey: "AIzaSyD51ycwqznba2t3nw6-CUP6Hn6KBpG0Fw8",
  authDomain: "shoppinglist-schmuckli.firebaseapp.com",
  databaseURL: "https://shoppinglist-schmuckli.firebaseio.com/",
  storageBucket: "shoppinglist-schmuckli.appspot.com",
  projectId: "shoppinglist-schmuckli"
});

const i18n = new VueI18n({
  locale: getLanguage(), // set locale
  fallbackLocale: 'en',
  messages: translations // set locale messages
});

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      i18n,
      render: h => h(App)
    }).$mount('#app');
  }
});
