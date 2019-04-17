<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg3 md4 sm6 xs12 v-for="(list) in lists" :key="list.id">
        <List :list="list" :amount_items="lists_meta[list.id]" />
      </v-flex>
    </v-layout>
    <v-btn fab dark color="#24919B" fixed right bottom>
        <v-icon @click="openNewList" dark>add</v-icon>
    </v-btn>
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
    openNewList(){
      this.$router.replace("new_list");
    },
    loadLists(){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists")
      .onSnapshot(function(lists) {
        global_this.lists = [];
        lists.forEach(function(list){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(list.id).collection("items")
          .onSnapshot(function(items){
            var current_list_id = items.query._query.path.segments[3];
            var not_purchased_items_counter = 0;
            items.forEach(function(item){
              if(!item.data().purchased){
                not_purchased_items_counter++;
              }
            });

            //Equal to global_this.lists_meta[key] = value
            //https://forum.vuejs.org/t/solved-how-to-rerender-from-add-remove-of-an-array-element-when-array-is-property-of-exported-object-a-set-issue/18723
            global_this.$set(global_this.lists_meta, current_list_id, not_purchased_items_counter);
          });
          global_this.lists.push(Object.assign({id: list.id}, list.data()));
        });
      });
    }
  }
}
</script>
