<template>
  <v-container>
    <h1 class="form_card">{{ $t("app.products") }}</h1>
    <v-layout row wrap v-if="!isEmpty">
      <v-flex lg3 md4 sm6 xs12 v-for="(product) in products" :key="product.id">
        <v-card class="form_card">
          <v-card-text style="padding:3px;">
            <v-layout row>
              <v-flex xs6>
                <b>{{ product.name }}</b><br>
                <span style="color:grey;">{{ product.id }}</span>
              </v-flex>
              <v-flex xs6 style="text-align:right;color:black;">
                <v-icon>edit</v-icon>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Products",
  data(){
    return {
      products: [],
    }
  },
  computed: {
    isEmpty(){
      return this.products.length == 0;
    }
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
