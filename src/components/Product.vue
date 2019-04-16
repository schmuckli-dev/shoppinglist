<template>
  <v-card :color="backgroundColor" @click="setPurchased" class="product">
    <v-card-title>
      <div class="big">
        <span v-html="bigTitle"></span>
      </div>
      <v-layout>
        <v-flex xs3>
          {{ amount }}
        </v-flex>
        <v-flex xs9>
          {{ name }}
        </v-flex>
      </v-layout>
    </v-card-title>
  </v-card>
</template>
<script>
import firebase from "firebase";

export default {
  name: "Product",
  props: {
    amount: String,
    name: String,
    purchased: Boolean,
    product_id: String,
    list_id: String
  },
  computed: {
    bigTitle(){
      return this.name.charAt(0);
    },
    backgroundColor(){
      return this.purchased ? "#DFDFDF" : "#42A7B0";
    }
  },
  methods: {
    setPurchased(){
      var global_this = this;
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(this.list_id).collection("items").doc(this.product_id).set({
        purchased: !global_this.purchased,
        modifiedDate: (new Date()).getTime()
      }, { merge: true });
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
  font-size:30px;
  width:100%;
  text-align: center;
  margin-bottom:20px;
}
</style>
