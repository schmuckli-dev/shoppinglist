<template>
  <v-container>
    <h1 class="form_card">{{ $t("app.lists") }}</h1>
    <v-layout row wrap v-if="!isEmpty">
      <v-flex lg3 md4 sm6 xs12 v-for="(list) in lists" :key="list.id">
        <List :list="list" :amount_items="lists_meta[list.id]" />
      </v-flex>
    </v-layout>
    <div v-if="isEmpty && !isLoading" style="text-align:center;margin-top:20px;">
      <v-icon style="font-size:100px;margin-bottom:10px;color:black;">mood_bad</v-icon><br>
      {{ $t("app.noListsYet") }}
    </div>
    <div v-if="isLoading" style="text-align:center;margin-top:20px;">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-btn fab dark color="#24919B" fixed right bottom style="margin-bottom:60px;">
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

      isLoading: true
    }
  },
  computed: {
    isEmpty(){
      return this.lists.length == 0;
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
        global_this.isLoading = false;
      });
    }
  }
}
</script>
