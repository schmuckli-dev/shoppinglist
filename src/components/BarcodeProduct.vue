<template>
  <div>
    <v-card class="form_card">
      <v-card-text style="padding:3px;">
        <v-layout row>
          <v-flex xs6>
            <b>{{ name }}</b><br>
            <span style="color:grey;">{{ barcode }}</span>
          </v-flex>
          <v-flex xs6 style="text-align:right;color:black;">
            <v-icon @click="dialogEdit = true">edit</v-icon>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <!-- Edit dialog -->
    <v-dialog v-model="dialogEdit" width="500">
      <v-card>
        <v-card-title class="headline lighten-2">
          {{ $t("list.edit") }}
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="dialogEditProductName"
              :label="$t('general.name')"
            ></v-text-field>
          <h3>{{ $t("app.deleteProduct") }}</h3>
          <v-btn color="red" style="color:white;" @click="dialogDelete = true">{{ $t("general.delete") }}</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogEdit = false">{{ $t("general.cancel") }}</v-btn>
          <v-btn flat @click="saveEditDialog">{{ $t("general.save") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete dialog -->
    <v-dialog v-model="dialogDelete" width="500">
      <v-card>
        <v-card-title class="headline lighten-2" primary-title>
          {{ $t("general.delete") }}
        </v-card-title>
        <v-card-text>
          {{ $t("app.doYouReallyWantToDeleteThisProduct") }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogDelete = false">{{ $t("general.cancel") }}</v-btn>
          <v-btn flat color="red" @click="deleteConfirm">{{ $t("general.delete") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
import { StoreMod } from "../store";

export default{
  name: "BarcodeProduct",
  props: {
    name: String,
    barcode: String
  },
  data(){
    return {
      dialogEdit: false,
      dialogDelete: false,

      dialogEditProductName: this.name
    }
  },
  methods: {
    saveEditDialog(){
      var global_this = this;
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("barcodes").doc(this.barcode).update({
        name: global_this.dialogEditProductName,
        name_ic: global_this.dialogEditProductName.toLowerCase()
      }).then(function () {
        StoreMod.showNotification(global_this.$t("notification.saved"));
        global_this.name = global_this.dialogEditProductName;
        global_this.dialogEdit = false;
      }).catch(function(){
        StoreMod.showNotification(global_this.$t("notification.thereWasAnErrorWhileSaving"));
      });
    },
    deleteConfirm(){
      var global_this = this;
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("barcodes").doc(this.barcode).delete().then(function(){
        StoreMod.showNotification(global_this.$t("notification.deleted"));
      }).catch(function(){
        StoreMod.showNotification(global_this.$t("notification.thereWasAnErrorWhileDeleting"));
      });
    }
  },
  watch: {
    name(val){
      this.dialogEditProductName = val;
    }
  }
}
</script>
