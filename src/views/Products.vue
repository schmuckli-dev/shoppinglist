<template>
  <v-container>
    <div class="form_card">
      <v-layout row>
        <v-flex xs8>
          <h1>{{ $t("app.products") }} <v-icon style="margin-bottom:3px;" @click="openInfo = !openInfo">info</v-icon></h1>
          <p v-if="openInfo">{{ $t("app.productsDescription") }}</p>
        </v-flex>
        <v-flex xs4 style="text-align:right;">
          <v-btn :href="csv_export" download="products.csv"><v-icon style="margin-right:10px;">fal fa-file-csv</v-icon> {{ $t("app.export") }}</v-btn>
        </v-flex>
      </v-layout>
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
      products: [],
      csv_data: []
    }
  },
  computed: {
    isEmpty(){
      return this.products.length == 0;
    },
    csv_export(){
      //Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
      let csvContent = "data:text/csv;charset=utf-8,";
      this.csv_data.forEach(function(rowArray){
         let row = rowArray.join(",");
         csvContent += row + "\r\n";
      });

      return encodeURI(csvContent);
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
        global_this.csv_export = [["barcode", "product"]]; //Title rows
        barcodes.forEach(function(barcode){
          var data = barcode.data();
          global_this.products.push(Object.assign({id: barcode.id}, data));
          global_this.csv_data.push([barcode.id, data.name]);
        });
      });
    }
  }
}
</script>
