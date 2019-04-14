<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg3 md4 sm6 xs12 v-for="list in lists" :key="list.id">
        <Product />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/*import firebase from "firebase";
import { Store } from "./../store";*/

export default {
  name: "Home",
  data(){
    return {
      lists: []
    }
  },
  mounted(){
    this.loadLists();
  },
  methods: {
    loadLists(){

    }
  }
}
</script>
