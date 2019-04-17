<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat><v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">

      </v-flex>
    </v-layout>
    <v-text-field :label="$t('new.product')" v-model="current_product" />
    <v-layout row wrap>
      <v-flex xs6 sm4 md3 lg2 v-for="product in suggestions" :key="product.id">
        <Product :name="product.name" :product_id="product.id" :suggestion="Boolean(true)" />
      </v-flex>
      <v-flex xs6 sm4 md3 lg2 v-show="!doesMatchWithSuggestions">
        <Product :name="current_product" :suggestion="Boolean(true)" v-show="current_product != ''" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { Store, StoreMod } from "./../store";
import Product from "./../components/Product";

export default {
  name: "List",
  data(){
    return {
      suggestions: [],
      current_product: ""
    }
  },
  components:{
    Product
  },
  computed: {
    currentListId(){
      return Store.currentList.id;
    },
    doesMatchWithSuggestions(){
      var global_this = this;
      var found = false;
      this.suggestions.forEach(function(current){
        if(current.name.toLowerCase() === global_this.current_product.toLowerCase()){
          found = true;
        }
      });
      return found;
    }
  },
  mounted(){
    if(Store.currentList.id == undefined){
      this.$router.replace("home");
    } else {
      this.queryProducts("");
    }
  },
  methods: {
    back(){
      this.$router.replace("list");
    },
    queryProducts(value){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").orderBy("name")
      .onSnapshot(function(products) {
        global_this.suggestions = [];
        if(products.length >= 1){
          StoreMod.new_setCurrentSelectedProduct("");
        }
        products.forEach(function(product){
          if(product.data().name.toLowerCase().indexOf(value.toLowerCase()) !== -1){ //Search
            if(global_this.suggestions.length < 5) {
              global_this.suggestions.push(Object.assign({id: product.id}, product.data()));
            }
          }
        });
      });
    },
  },
  watch: {
    current_product(val){
      this.queryProducts(val);
    }
  }
}
</script>
<style>
h3{
  margin-bottom: 10px;
}
</style>
