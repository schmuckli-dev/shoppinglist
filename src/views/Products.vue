<template>
  <v-container>
    <div class="form_card">
      <h1>{{ $t("app.products") }} <v-icon style="margin-bottom:3px;" @click="openInfo = !openInfo">info</v-icon></h1>
      <p v-if="openInfo">{{ $t("app.productsDescription") }}</p>
    </div>
    <v-layout row wrap v-if="!isEmpty">
      <v-flex lg3 md4 sm6 xs12 v-for="(product) in products" :key="product.id">
        <BarcodeProduct :name="product.name" :barcode="product.id"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import BarcodeProduct from "../components/BarcodeProduct";

export default {
  name: "Products",
  data(){
    return {
      openInfo: false,
      products: []
    }
  },
  computed: {
    isEmpty(){
      return this.products.length == 0;
    }
  },
  components: {
    BarcodeProduct
  },
  mounted(){
    this.loadProducts();
  },
  methods: {
    loadProducts(){
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("barcodes").orderBy("name_ic", "asc")
      .onSnapshot(function(barcodes) {
        global_this.products = [];
        barcodes.forEach(function(barcode){
          var data = barcode.data();
          global_this.products.push(Object.assign({id: barcode.id}, data))
        });
      });
    }
  }
}
</script>
