<template>
  <v-card color="#fff" @click="openList" class="shoppinglist_list">
    <v-card-title primary-title>
      <div>
        <div class="headline">{{ list.name }}</div>
      </div>
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
    }
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
