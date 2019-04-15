<template>
  <v-card :color="backgroundColor" @click="setPurchased">
    <v-card-title>
      <div class="big">
        <span v-html="bigTitle"></span>
      </div>
      <v-layout>
        <v-flex xs6>
          {{ amount }}
        </v-flex>
        <v-flex xs6>
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
      return this.purchased ? "#7D7D7D" : "#42A7B0";
    }
  },
  methods: {
    setPurchased(){
      var global_this = this;
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists").doc(this.list_id).collection("items").doc(this.product_id).set({
        purchased: !global_this.purchased
      }, { merge: true });
    }
  }
}
</script>
<style scoped>
.v-card__title--primary{
  padding:0;
}
.big{
  font-size:30px;
  width:100%;
  text-align: center;
  margin-bottom:20px;
}
</style>
