<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg3 md4 sm6 xs12 v-for="list in lists" :key="list.id">
        <List :title="list.name" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
//import { StoreMod } from "./../store";
import List from "../components/List";

export default {
  name: "Home",
  data(){
    return {
      lists: []
    }
  },
  components: {
    List
  },
  mounted(){
    this.loadLists();
  },
  methods: {
    loadLists(){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists")
      .onSnapshot(function(lists) {
        global_this.lists = [];
        lists.forEach(function(list){
          global_this.lists.push(list.data());
        });
      });
    }
  }
}
</script>
