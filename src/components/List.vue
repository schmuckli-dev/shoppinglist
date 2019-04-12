<template>
  <v-card color="#fff" class="white--text">
    <v-card-title primary-title>
      <div>
        <div class="headline" style="color:#000;">{{ title }}</div>
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
