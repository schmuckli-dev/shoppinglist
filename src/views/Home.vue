<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg3 md4 sm6 xs12 v-for="(list, index) in lists" :key="list.id">
        <List :list="list" :amount_items="lists_meta[index]" />
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
      lists: [],
      lists_meta: [],
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
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(list.id).collection("items")
          .onSnapshot(function(items){
            var not_purchased_items_counter = 0;
            items.forEach(function(item){
              if(!item.data().purchased){
                not_purchased_items_counter++;
              }
            });
            global_this.lists_meta.push(not_purchased_items_counter);
          });
          global_this.lists.push(Object.assign({id: list.id}, list.data()));
        });
      });
    }
  }
}
</script>
