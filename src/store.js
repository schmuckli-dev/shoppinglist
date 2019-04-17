import Vue from 'vue';

export const Store = Vue.observable({
  notification: "",
  currentList: {},

  //New product page
  new_CurrentSelectedProduct: undefined
});

export const StoreMod = {
  showNotification(notification){
    Store.notification = notification;
  },
  setCurrentList(list_data){
    Store.currentList = list_data;
  },

  new_setCurrentSelectedProduct(product){
    Store.new_CurrentSelectedProduct = product;
  }
};
