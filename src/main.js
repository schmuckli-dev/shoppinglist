import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './plugins/vuetify'
import { translations, getLanguage } from './translation.js';
import App from './App.vue'
import router from './router';
import firebase from "firebase";

import { sCAuth } from "schmucklicloud_auth";

Vue.config.productionTip = false

Vue.use(VueI18n);

let app = '';

firebase.initializeApp({
  apiKey: "AIzaSyD51ycwqznba2t3nw6-CUP6Hn6KBpG0Fw8",
  authDomain: "shoppinglist-schmuckli.firebaseapp.com",
  databaseURL: "https://shoppinglist-schmuckli.firebaseio.com",
  projectId: "shoppinglist-schmuckli",
  storageBucket: "shoppinglist-schmuckli.appspot.com",
  messagingSenderId: "762486583011",
  appId: "1:762486583011:web:fadba23f4cc9b98c"
});

window.sCAuth = new sCAuth(
  "883f26f113c50dc96955a342c07d8e8e5b740b38",
  "11d0e9ca9cbd9a2903fbec28b1c5fdfc2d23bb3dc04c47e7adb5f5feb618b23f"
);

firebase.performance();

const i18n = new VueI18n({
  locale: getLanguage(), // set locale
  fallbackLocale: 'en',
  messages: translations // set locale messages
});

if (!app) {
  /* eslint-disable no-new */
  app = new Vue({
    router,
    i18n,
    render: h => h(App)
  }).$mount('#app');
}
