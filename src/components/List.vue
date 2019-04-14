<template>
  <v-card color="#fff" class="shoppinglist_list">
    <v-card-title primary-title>
      <div>
        <div class="headline">{{ title }}</div>
      </div>
    </v-card-title>
  </v-card>
</template>
<script>
export default{
  name: "List",
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.shoppinglist_list{
  margin: 10px;
}
</style>
