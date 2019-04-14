import Vue from 'vue';

export const Store = Vue.observable({
  notification: "",
  currentList: {}
});

export const StoreMod = {
  showNotification(notification){
    Store.notification = notification;
  },
  setCurrentList(list_data){
    StoreMod.currentList = list_data;
  }
};
