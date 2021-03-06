<template>
  <v-card :color="backgroundColor" :style="style" @click="setClicked" class="product">
    <v-card-title>
      <div class="big">
        <span v-if="bigTitle.length === 1">{{ bigTitle }}</span>
        <i :class="bigTitle"></i>
      </div>
      <v-layout>
        <v-flex xs3 v-if="amount != undefined && amount != ''">
          <span class="subtitle">{{ amount }}</span>
        </v-flex>
        <v-flex xs9 v-if="amount != undefined && amount != ''">
          <span class="subtitle">{{ name }}</span>
        </v-flex>
        <v-flex xs12 v-if="amount == undefined || amount == ''" style="text-align:center;">
          <span class="subtitle">{{ name }}</span>
        </v-flex>
      </v-layout>
    </v-card-title>
  </v-card>
</template>
<script>
import firebase from "firebase";
import { Store, StoreMod } from "../store";
import ProductDetector from "../controller/ProductDetector";

export default {
  name: "Product",
  props: {
    amount: String,
    name: String,
    purchased: Boolean,
    suggestion: {
      type: Boolean,
      default: false
    },
    product_id: String,
    list_id: String
  },
  data(){
    return {
      selected: false
    }
  },
  computed: {
    bigTitle(){
      return ProductDetector.getProductIcon(this.name);
    },
    backgroundColor(){
      if(!this.suggestion){
        return this.purchased ? "#DFDFDF" : "#42A7B0";
      } else {
        return !this.selected ? "#DFDFDF" : "#42A7B0";
      }
    },
    style(){
      if(!this.suggestion){
        return this.purchased ? "color:black;" : "color:white;";
      } else {
        return !this.selected ? "color:black;" : "color:white;";
      }
    },
    newCurrentSelectedProduct(){
      return Store.new_CurrentSelectedProduct;
    }
  },
  methods: {
    setClicked(){
      var global_this = this;
      if(!this.suggestion){ //Normal list to mark a product as purchased
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(this.list_id).collection("items").doc(this.product_id).set({
          purchased: !global_this.purchased,
          modifiedDate: (new Date()).getTime()
        }, { merge: true });
      } else { //If you want to add a new product to the list --> Suggestion view
        StoreMod.new_setCurrentSelectedProduct(this.name);
        setTimeout(function(){ //Timout because of the reactive change below in the watcher
          global_this.selected = true;
        },2);
      }
    }
  },
  watch: {
    newCurrentSelectedProduct(){
      this.selected = false;
    }
  }
}
</script>
<style scoped>
.v-card__title--primary{
  padding:0;
}
.product{
  margin: 10px;
  cursor: pointer;
}
.big{
  font-size:40px;
  width:100%;
  text-align: center;
  margin-bottom:10px;
  font-weight: bold;
}
.subtitle{
  font-size: 17px;
}
</style>
