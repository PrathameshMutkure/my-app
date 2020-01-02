// Required Maps
let productMap;
let categoryMap;
let combinedProductMap;

/*
 * Method to create and return map of products if its not already created
 */
function getProducts() {

  let productMapToBeReturned = {};

  if (!(productMap && productMap.size)) {
    const productData = require('./src/data/products.json');

    productData.products.forEach(product => {
      productMapToBeReturned[product.id] = product;
    });
  }

  return productMap = productMapToBeReturned;
}

/*
 * Method to create and return map of categories if not already created
 */
function getCategories() {

  let categoryMapToBeReturned = {};

  if (!(categoryMap && categoryMap.size)) {
    const categoryData = require('./src/data/categories.json');

    categoryData.categories.forEach(category => {
      categoryMapToBeReturned[category.id] = category.categoryName;
    });
  }

  return categoryMap = categoryMapToBeReturned;
}

/*
 * Method to combine product and category data into combinedProductMap
 */
function combineProductsWithCategories() {

  // Creating productMap and categoryMap using above functions
  getProducts();
  getCategories();

  combinedProductMap = {};

  Object.values(productMap).forEach(product => {
    product.categoryName = categoryMap[product.categoryId];
    combinedProductMap[product.id] = product;
  });
}

/*
 * Creates combinedProductMap if it is null
 */
function getCombinedProductMap() {

  if (!(combinedProductMap && combinedProductMap.size)) {
    combineProductsWithCategories();
  }
  return combinedProductMap;
}

module.exports.getCategories = getCategories();
module.exports.getCombinedProductMap = getCombinedProductMap();
