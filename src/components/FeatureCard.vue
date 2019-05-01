<template>
  <v-card class="form_card">
    <h2>Main features</h2>
    <v-list three-line>
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon color="blue" style="font-size:40px;margin-top:16px;">fal fa-barcode-read</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Scan</v-list-tile-title>
          <v-list-tile-sub-title>When you want to add a new product to your list, just use the scanner to add them by a barcode.</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon color="red" style="font-size:40px;">offline_bolt</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Offline</v-list-tile-title>
          <v-list-tile-sub-title>Thanks to the power of progessive web apps, you can also access your current passes even without an active internet connection.</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon color="green" style="font-size:40px;">import_export</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Export</v-list-tile-title>
          <v-list-tile-sub-title>Just simply import and export your products in a CSV, so you can transfer them easily.</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>
