<template>
  <v-container>
    <div style="text-align:center;margin-top:50px;">
      
    </div>
  </v-container>
</template>

<script>
import { StoreMod } from "./../store";

export default {
  name: "Home",
  methods: {
    goArchive(){
      if (navigator.onLine) {
        this.$router.replace("archive");
      } else {
        StoreMod.showNotification("notification.youCantVisitTheArchiveWhileYouAreOffline");
      }
    }
  }
}
</script>
