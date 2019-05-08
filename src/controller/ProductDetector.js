import data from "../data/product_icons";

export default class ProductDetector {
  static getProductIcon(product_name){
    let result = product_name.charAt(0).toUpperCase();
    let result_found = false;

    data.products.forEach(function(product){
      if (!result_found) {
        product.names.forEach(function(name){
          if(name.indexOf(product_name.toLowerCase()) > -1 || product_name.toLowerCase().indexOf(name) > -1) {
            result = "fal fa-" + product.icon;
            result_found = true;
          }
        })
        /*if (product.names.indexOf(product_name.toLowerCase()) > -1) {

        }*/
      }
    });

    return result;
  }
}
