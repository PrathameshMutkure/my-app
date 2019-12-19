// import express (after npm install express)
const express = require('express');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 3000;

// Getting data from json files
const packageData = require('./package.json');
const categoryData = require('./src/data/categories.json');
const productData = require('./src/data/products.json');

// create a route for the app
app.get('/', (req, res) => {
  res.send('Hello World');
});

// create a route for the /info endpoint
app.get('/info', (req, res) => {
  res.send({ serverName: packageData.name, serverVersion: packageData.version });
});

// route for displaying all products
app.get('/products/all', (req, res) => {

  const jsonOutputObject = {
    products: []
  };

  for (let product of productData.products) {

    // Deep copying to prevent changes in original JSON object in next step
    const productToBeInserted = JSON.parse(JSON.stringify(product));

    // Adding category name to product
    for (let category of categoryData.categories) {
      if (product.categoryId === category.id) {
        productToBeInserted.categoryName = category.categoryName;
        break;
      }
    }

    jsonOutputObject.products.push(productToBeInserted);
  }

  res.send(jsonOutputObject);
});

// Getting product info from its ID
app.get('/product/:id', (req, res) => {

  const userInput = req.params.id;
  let productId;
  let jsonOutputObject = null;

  // Generating valid ID and returning error message when ID is invalid
  if (userInput < 1) {
    res.send('Invalid product ID');
    return;
  } else {
    productId = `P${userInput.padStart(3, '0')}`
  }

  for (let product of productData.products) {
    if (product.id === productId) {
      jsonOutputObject = product;
      break;
    }
  }

  // Checking for null at the end would cause NullPointerException when trying to get the categoryName
  if (jsonOutputObject == null) {
    res.send('Product not found!');
    return;
  }

  for (let category of categoryData.categories) {
    if (jsonOutputObject.categoryId === category.id) {
      jsonOutputObject.categoryName = category.categoryName;
    }
  }

  res.send(jsonOutputObject);
});

// Getting all the products under a category based on category's ID
app.get('/category/:ctyId', (req, res) => {

  const userInput = req.params.ctyId;
  let categoryId;
  let categoryNameVal;

  // Generating valid ID and returning error message when ID is invalid
  if (userInput < 1) {
    res.send('Invalid category ID')
    return;
  } else {
    categoryId = `cty${userInput.padStart(2, '0')}`
  }

  // Getting category name
  for (let category of categoryData.categories) {
    if (category.id === categoryId) {
      categoryNameVal = category.categoryName;
      break;
    }
  }

  const jsonOutputObject = {
    category: categoryId,
    categoryName: categoryNameVal,
    products: []
  };

  for (let product of productData.products) {
    if (product.categoryId === categoryId) {
      jsonOutputObject.products.push(product)
    }
  }

  if (jsonOutputObject.products.length === 0) {
    res.send('Category not found!');
  } else {
    res.send(jsonOutputObject);
  }
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
