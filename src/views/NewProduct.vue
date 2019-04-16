<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat><v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">

      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6 sm4 md3 lg2 v-for="product in products" :key="product.id">
        <Product :amount="product.amount" :name="product.name" :product_id="product.id" :purchased="product.purchased" :list_id="currentListId" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { Store } from "./../store";
import Product from "./../components/Product";

export default {
  name: "List",
  data(){
    return {
      products: []
    }
  },
  mounted(){
    this.loadProducts();
  },
  components:{
    Product
  },
  computed: {
    currentListId(){
      return Store.currentList.id;
    }
  },
  methods: {
    back(){
      this.$router.replace("list");
    },
    loadProducts(){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").orderBy("purchased").orderBy("modifiedDate", "desc")
      .onSnapshot(function(products) {
        global_this.products = [];
        products.forEach(function(product){
          global_this.products.push(Object.assign({id: product.id}, product.data()));
        });
      });
    },
    openEditDialog(){

    }
  }
}
</script>
<style>
h3{
  margin-bottom: 10px;
}
</style>
