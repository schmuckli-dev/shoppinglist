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
      <v-text-field ref="focussed_field" outline :label="$t('new.product')" v-model="current_product" />
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
      current_product: "",
      current_amount: "",
      step: 1
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
          StoreMod.new_setCurrentSelectedProduct(undefined);
          global_this.current_product = "";
          global_this.current_amount = "";
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
.selected_title{
  font-size:17px;
  margin-left:10px;
}
</style>
