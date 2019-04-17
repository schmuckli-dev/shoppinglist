<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat><v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">

      </v-flex>
    </v-layout>
    <v-text-field ref="focussed_field" v-model="list_name" outline :label="$t('new.list')" />
    <v-btn color="primary" @click="add">{{ $t("new.add") }}</v-btn>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { StoreMod } from "./../store";

export default {
  name: "NewList",
  data(){
    return {
      list_name: ""
    }
  },
  mounted(){
    this.$refs.focussed_field.focus();
  },
  methods: {
    back(){
      this.$router.replace("home");
    },
    add(){
      var global_this = this;
      if(this.list_name != ""){
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").add({
          name: this.list_name
        }).then(function(){
          StoreMod.showNotification(global_this.$t("notification.listHasBeenCreated"));
          global_this.$router.replace("home");
        }).catch(function(){
          StoreMod.showNotification("notification.thereWasAnErrorWhileSaving")
        });
      }
    }
  }
}
</script>
<style>
h3{
  margin-bottom: 10px;
}
.selected_title{
  font-size:17px;
  margin-left:10px;
}
</style>
