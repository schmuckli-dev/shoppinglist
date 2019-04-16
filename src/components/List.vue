<template>
  <v-card color="#fff" @click="openList" class="shoppinglist_list">
    <v-card-title>
      <v-layout row>
        <v-flex xs6>
          <div class="headline">{{ list.name }}</div>
        </v-flex>
        <v-flex xs6 style="text-align:right;">
          <div class="headline">{{ amount_items }}</div>
        </v-flex>
      </v-layout>
    </v-card-title>
  </v-card>
</template>
<script>
import { StoreMod } from "./../store";

export default{
  name: "List",
  props: {
    list: {
      type: Object,
      required: true
    },
    amount_items: Number
  },
  methods: {
    openList(){
      StoreMod.setCurrentList(this.list);
      this.$router.replace("list");
    }
  }
}
</script>
<style scoped>
.shoppinglist_list{
  margin: 10px;
  cursor: pointer;
}
</style>
