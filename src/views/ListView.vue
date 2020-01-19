<template>
  <v-container>
    <v-layout row>
      <v-flex xs6>
        <v-btn @click="back" flat>
          <v-icon style="margin-right:10px;">keyboard_arrow_left</v-icon>
          {{ $t("general.back") }}
        </v-btn>
      </v-flex>
      <v-flex xs6 style="text-align:right;">
        <v-btn @click="openEditDialog" flat>
          <v-icon style="margin-right:10px;">edit</v-icon>
          {{ $t("list.edit") }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-space-between row v-if="!isEmpty">
      <v-flex xs3>
        <h1 class="form_card">{{ currentListName }}</h1>
      </v-flex>
      <v-flex lg2 md3 sm4 xs5 style="text-align:right;">
        <v-switch
          v-model="gridViewActive"
          :label="gridViewActive ? $t('general.gridView') : $t('general.listView')"
          color="primary"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-expand-transition>
      <v-layout row wrap v-show="!isEmpty && gridViewActive">
        <v-flex xs6 sm4 md3 lg2 v-for="product in products" :key="product.id">
          <Product
            :amount="product.amount"
            :name="product.name"
            :product_id="product.id"
            :purchased="product.purchased"
            :list_id="currentListId"
          />
        </v-flex>
        <v-flex
          xs6
          sm4
          md3
          lg2
          v-for="product in purchased_products"
          :key="product.id"
          class="faded"
        >
          <Product
            :amount="product.amount"
            :name="product.name"
            :product_id="product.id"
            :purchased="product.purchased"
            :list_id="currentListId"
          />
        </v-flex>
      </v-layout>
    </v-expand-transition>
    <v-expand-transition>
      <v-layout row wrap v-show="!isEmpty && !gridViewActive">
        <v-flex xs12 v-for="product in products" :key="product.id">
          <ProductListView
            :amount="product.amount"
            :name="product.name"
            :product_id="product.id"
            :purchased="product.purchased"
            :list_id="currentListId"
          />
        </v-flex>
        <v-flex xs12 v-for="product in purchased_products" :key="product.id" class="faded">
          <ProductListView
            :amount="product.amount"
            :name="product.name"
            :product_id="product.id"
            :purchased="product.purchased"
            :list_id="currentListId"
          />
        </v-flex>
      </v-layout>
    </v-expand-transition>
    <div v-if="isEmpty && !isLoading" style="text-align:center;margin-top:20px;">
      <v-icon style="font-size:100px;margin-bottom:10px;color:black;">mood_bad</v-icon>
      <br />
      {{ $t("list.noProductsYet") }}
    </div>
    <div v-if="isLoading" style="text-align:center;margin-top:20px;">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <v-btn fab dark color="#24919B" fixed right bottom style="margin-bottom:60px;">
      <v-icon @click="openNewProduct" dark>add</v-icon>
    </v-btn>

    <!-- Edit dialog -->
    <v-dialog v-model="dialogEdit" width="500">
      <v-card>
        <v-card-title class="headline lighten-2">{{ $t("settings.settings") }}</v-card-title>
        <v-card-text>
          <h3>{{ $t("list.edit") }}</h3>
          <v-text-field v-model="dialogEditListName" :label="$t('general.name')"></v-text-field>
          <!--<h3>{{ $t("list.share") }}</h3>
          <p>{{ $t("list.shareDescription") }}</p>
          <v-text-field
              v-model="shareAddEmail"
              :label="$t('settings.email')"
            ></v-text-field>
          <v-btn @click="addSharedEmail">{{ $t("general.add") }}</v-btn>-->
          <h3>{{ $t("general.delete") }}</h3>
          <v-btn
            color="red"
            style="color:white;"
            @click="dialogDelete = true"
          >{{ $t("general.delete") }}</v-btn>
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
        <v-card-title class="headline lighten-2" primary-title>{{ $t("general.delete") }}</v-card-title>
        <v-card-text>{{ $t("list.doYouReallyWantToDeleteThisList") }}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogDelete = false">{{ $t("general.cancel") }}</v-btn>
          <v-btn flat color="red" @click="deleteConfirm">{{ $t("general.delete") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { Store, StoreMod } from "./../store";
import Product from "./../components/Product";
import ProductListView from "./../components/ProductListView";

export default {
  name: "ListView",
  data() {
    return {
      products: [],
      purchased_products: [],
      dialogEdit: false,
      dialogDelete: false,
      dialogEditListName: Store.currentList.name,

      isLoading: true,
      gridViewActive: true
    };
  },
  mounted() {
    this.checkViewMode();
    if (Store.currentList.id == undefined) {
      this.$router.replace("home");
    } else {
      this.loadProducts();
    }
  },
  components: {
    Product,
    ProductListView
  },
  computed: {
    currentListId() {
      return Store.currentList.id;
    },
    currentListName() {
      return Store.currentList.name;
    },
    isEmpty() {
      return this.products.length == 0 && this.purchased_products.length == 0;
    }
  },
  methods: {
    back() {
      this.$router.replace("home");
    },
    loadProducts() {
      var global_this = this;
      var db = firebase.firestore();
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(Store.currentList.id)
        .collection("items")
        .orderBy("modifiedDate", "desc")
        .where("purchased", "==", false)
        .onSnapshot(function(products) {
          global_this.products = [];
          products.forEach(function(product) {
            global_this.products.push(
              Object.assign({ id: product.id }, product.data())
            );
          });
          global_this.isLoading = false;
        });
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(Store.currentList.id)
        .collection("items")
        .orderBy("modifiedDate", "desc")
        .where("purchased", "==", true)
        .limit(4)
        .onSnapshot(function(products) {
          global_this.purchased_products = [];
          products.forEach(function(product) {
            global_this.purchased_products.push(
              Object.assign({ id: product.id }, product.data())
            );
          });
          global_this.isLoading = false;
        });
    },
    openNewProduct() {
      this.$router.replace("new_product");
    },
    openEditDialog() {
      this.dialogEdit = true;
    },
    saveEditDialog() {
      var global_this = this;
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(Store.currentList.id)
        .update({
          name: global_this.dialogEditListName
        })
        .then(function() {
          global_this.dialogEdit = false;
          StoreMod.setCurrentList(
            Object.assign(
              { id: Store.currentList.id },
              { name: global_this.dialogEditListName }
            )
          );
          StoreMod.showNotification(global_this.$t("notification.saved"));
        })
        .catch(function() {
          StoreMod.showNotification(
            global_this.$t("notification.thereWasAnErrorWhileSaving")
          );
        });
    },
    deleteConfirm() {
      var global_this = this;
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(Store.currentList.id)
        .delete()
        .then(function() {
          global_this.dialogDelete = false;
          global_this.dialogEdit = false;
          global_this.$router.replace("home");
          StoreMod.showNotification(global_this.$t("notification.deleted"));
        })
        .catch(function() {
          StoreMod.showNotification(
            global_this.$t("notification.thereWasAnErrorWhileDeleting")
          );
        });
    },
    checkViewMode() {
      this.gridViewActive =
        window.localStorage.getItem("gridViewActive") === undefined ? true : window.localStorage.getItem("gridViewActive") === "false" ? false : true;
    }
  },
  watch: {
    gridViewActive(value) {
      window.localStorage.setItem("gridViewActive", value);
    }
  }
};
</script>
<style scoped>
h3 {
  margin-bottom: 10px;
}
.faded {
  opacity: 0.3;
}
</style>
