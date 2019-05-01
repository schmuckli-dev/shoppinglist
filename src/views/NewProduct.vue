<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat><v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon> {{ $t("general.back") }}</v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">

      </v-flex>
    </v-layout>
    <div id="select_product" v-if="step == 1">
      <v-text-field ref="focussed_field" outline :label="$t('new.product')" v-model="current_product" @click:append="openScanner" append-icon="fal fa-barcode-read"
      :hint="current_hint" persistent-hint/>
      <v-layout row wrap>
        <v-flex xs6 sm4 md3 lg2 v-for="product in suggestions" :key="product.id">
          <Product :name="product.name" :product_id="product.id" :suggestion="Boolean(true)" />
        </v-flex>
        <v-flex xs6 sm4 md3 lg2 v-show="!doesMatchWithSuggestions">
          <Product :name="current_product" :suggestion="Boolean(true)" v-show="current_product != ''" />
        </v-flex>
      </v-layout>
      <div style="width:100%;text-align:right;">
        <v-btn @click="goToStep2" flat>{{ $t("general.forward") }} <v-icon>arrow_forward_ios</v-icon></v-btn>
      </div>
    </div>
    <div id="select_product_result" v-if="step != 1">
      <v-card class="form_card">
        <v-layout>
          <v-flex xs8>
            <span class="selected_title"><b>{{ $t("new.selectedProduct") }}</b></span><br>
            <span class="selected_title">{{ currentSelectedProduct }}</span>
          </v-flex>
          <v-flex xs4 style="text-align:right;">
            <v-btn @click="step = 1" flat>{{ $t('general.change') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
    <div id="set_amount" v-if="step == 2">
      <v-fade-transition>
        <v-card class="form_card">
          <span class="selected_title"><b>{{ $t("new.typeAmount") }} ({{ $t("general.optional") }})</b></span><br>
          <v-text-field outline v-model="current_amount" :label="$t('new.amount')" />
          <v-btn @click="addClose" color="primary">{{ $t("new.add") }} &amp; {{ $t("general.close") }}</v-btn>
          <v-btn @click="addNew" color="primary">{{ $t("new.add") }} &amp; {{ $t("general.new") }}</v-btn>
        </v-card>
      </v-fade-transition>
    </div>
    <!-- Scan dialog -->
    <v-dialog v-model="dialogScan" width="500">
      <v-card>
        <v-card-title class="headline lighten-2" primary-title>
          {{ $t("new.scan") }}
        </v-card-title>
        <v-card-text style="padding-top:0;text-align:center;">
          <v-progress-circular
            :size="50"
            color="primary"
            style="margin-top:30px;"
            indeterminate
            v-if="loadingScanner"
          ></v-progress-circular>
          <div id="outer_scan_area">
            <div id="scan_area">
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeScanner">{{ $t("general.cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { Store, StoreMod } from "./../store";
import Product from "./../components/Product";

import Quagga from "quagga";

export default {
  name: "NewProduct",
  data(){
    return {
      suggestions: [],
      current_product: "",
      current_amount: "",
      step: 1,

      dialogScan: false,
      loadingScanner: false,
      current_barcode: undefined,
      current_hint: ""
    }
  },
  components:{
    Product
  },
  computed: {
    currentListId(){
      return Store.currentList.id;
    },
    currentSelectedProduct(){
      return Store.new_CurrentSelectedProduct;
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
      this.$refs.focussed_field.focus();
    }
  },
  methods: {
    back(){
      this.$router.replace("list");
    },
    goToStep2(){
      if(Store.new_CurrentSelectedProduct != undefined){
        this.step = 2;
      } else {
        StoreMod.showNotification(this.$t("notification.pleaseSelectAProduct"));
      }
    },
    addClose(){
      var global_this = this;
      if(this.currentListId != undefined && this.currentSelectedProduct != undefined){
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").add({
          amount: this.current_amount,
          modifiedDate: (new Date()).getTime(),
          name: this.currentSelectedProduct,
          purchased: false
        })
        .then(function(){
          StoreMod.showNotification(global_this.$t("notification.theProductHasBeenAdded"));
          global_this.associateBarcode();
          global_this.$router.replace("list");
        }).catch(function(){
          StoreMod.showNotification(global_this.$t("notification.thereWasAnErrorWhileSaving"));
        });
      }
    },
    addNew(){
      var global_this = this;
      if(this.currentListId != undefined && this.currentSelectedProduct != undefined){
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(Store.currentList.id).collection("items").add({
          amount: this.current_amount,
          modifiedDate: (new Date()).getTime(),
          name: this.currentSelectedProduct,
          purchased: false
        })
        .then(function(){
          StoreMod.showNotification(global_this.$t("notification.theProductHasBeenAdded"));
          global_this.associateBarcode();

          StoreMod.new_setCurrentSelectedProduct(undefined);
          global_this.current_product = "";
          global_this.current_amount = "";
          global_this.current_barcode = undefined;
          global_this.current_hint = "";
          global_this.step = 1;
        }).catch(function(){
          StoreMod.showNotification(global_this.$t("notification.thereWasAnErrorWhileSaving"));
        });
      }
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
              var data = product.data();
              var duplicate = false;
              global_this.suggestions.forEach(function(suggestion){
                if(data.name == suggestion.name){
                  duplicate = true;
                }
              });
              if(!duplicate){
                global_this.suggestions.push(Object.assign({id: product.id}, data));
              }
            }
          }
        });
      });
    },
    openScanner(){
      this.dialogScan = true;
      this.initScanner();
    },
    restartScanner(){
      var global_this = this;

      this.current_barcode = undefined;
      this.dialogScan = false;
      setTimeout(function(){
        global_this.dialogScan = true;
        global_this.initScanner();
      }, 20);
    },
    initScanner(){
      var global_this = this;
      this.loadingScanner = true;
      Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#scan_area'),
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          },
        },
        decoder : {
          readers : ["ean_reader"]
        }
      }, function() {
          global_this.loadingScanner = false;
          Quagga.start();
          Quagga.onDetected(function(data){
            global_this.closeScanner()
            global_this.current_barcode = data.codeResult.code;
            global_this.matchProduct();
          });
      });
    },
    closeScanner(){
      this.dialogScan = false;
      Quagga.stop();
    },
    matchProduct(){
      var global_this = this;
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("barcodes").doc(this.current_barcode)
      .onSnapshot(function(result) {
        if(result.exists){
          global_this.current_product = result.data().name;
          StoreMod.new_setCurrentSelectedProduct(result.data().name);
          global_this.step = 2;
          global_this.current_hint = global_this.$t("new.productFoundFor") + " " + global_this.current_barcode;
        } else {
          global_this.current_hint = global_this.$t("new.noProductFoundSavingThisWillAssociateWithThisBarcode") + " " + global_this.current_barcode;
        }
      });
    },
    associateBarcode(){
      if(this.current_barcode){
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("barcodes").doc(this.current_barcode).set({
          name: Store.new_CurrentSelectedProduct,
          name_ic: Store.new_CurrentSelectedProduct.toLowerCase()
        });
      }
    }
  },
  watch: {
    current_product(val){
      this.queryProducts(val);
    },
    dialogScan(new_val){
      if(!new_val){
        this.closeScanner();
      }
    }
  }
}
</script>
<style>
h3{
  margin-bottom: 10px;
}
.selected_title{
  font-size:17px;
  margin-left:10px;
}
#scan_area{
  width: 100%;
  overflow: visible;
  height: 350px;
}
video {
  width: 100%;
}
</style>
