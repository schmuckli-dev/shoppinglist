<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat><v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">
        <v-btn @click="openEditDialog" flat><v-icon style="margin-right:10px;">edit</v-icon> {{ $t("list.edit") }}</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6 sm4 md3 lg2 v-for="product in products" :key="product.id">
        <Product :amount="product.amount" :name="product.name" :product_id="product.id" :purchased="product.purchased" :list_id="currentListId" />
      </v-flex>
      <v-flex xs6 sm4 md3 lg2 v-for="product in purchased_products" :key="product.id" class="faded">
        <Product :amount="product.amount" :name="product.name" :product_id="product.id" :purchased="product.purchased" :list_id="currentListId" />
      </v-flex>
    </v-layout>
    <v-btn fab dark color="#24919B" fixed right bottom>
        <v-icon @click="openNewProduct" dark>add</v-icon>
    </v-btn>
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
      products: [],
      purchased_products: []
    }
  },
  mounted(){
    if(Store.currentList.id == undefined){
      this.$router.replace("home");
    } else {
      this.loadProducts();
    }
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
      this.$router.replace("home");
    },
    loadProducts(){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").orderBy("modifiedDate", "desc").where("purchased", "==", false)
      .onSnapshot(function(products) {
        global_this.products = [];
        products.forEach(function(product){
          global_this.products.push(Object.assign({id: product.id}, product.data()));
        });
      });
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").orderBy("modifiedDate", "desc").where("purchased", "==", true).limit(4)
      .onSnapshot(function(products) {
        global_this.purchased_products = [];
        products.forEach(function(product){
          global_this.purchased_products.push(Object.assign({id: product.id}, product.data()));
        });
      });
    },
    openNewProduct(){
      this.$router.replace("new_product");
    },
    openEditDialog(){

    }
  }
}
</script>
<style scoped>
h3{
  margin-bottom: 10px;
}
.faded{
  opacity: 0.5;
}
</style>
