import data from "../data/product_icons";

export default class ProductDetector {
  static getProductIcon(product_name){
    let result = product_name.charAt(0).toUpperCase();
    let result_found = false;

    //Search first for exact results
    data.products.forEach(function(product){
      if (!result_found) {
        product.names.forEach(function(name){
          if(product_name.toLowerCase() === name.toLowerCase()) {
            result = "fal fa-" + product.icon;
            result_found = true;
          }
        })
      }
    });

    if(!result_found){
      //If nothing found, search for similar words
      data.products.forEach(function(product){
        if (!result_found) {
          product.names.forEach(function(name){
            if(name.toLowerCase().indexOf(product_name.toLowerCase()) > -1 || product_name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
              result = "fal fa-" + product.icon;
              result_found = true;
            }
          })
        }
      });
    }

    return result;
  }
}
