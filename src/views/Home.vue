<template>
  <v-container>
    <v-layout row wrap>
      <v-flex sm6 xs3 v-for="list in lists" :key="list.id">
        <List :title="list.title" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
//import { StoreMod } from "./../store";
import List from "../components/List";

export default {
  name: "Home",
  data(){
    return {
      lists: [{id: 1, title: "Migros"}]
    }
  },
  components: {
    List
  },
  methods: {
    loadLists(){
      if (navigator.onLine) {
        //
      } else {
        //
      }
    }
  }
}
</script>
