// import express (after npm install express)
const express = require('express');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 3000;

// Getting data from json files
const packageData = require('./package.json');

// Importing dataService.js file
const dataService = require('./dataService');

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
  res.send({ products: dataService.getCombinedProductMap });
});

// Getting product info from its ID
app.get('/product/:id', (req, res) => {

  const userInput = req.params.id;
  let productId;

  // Generating valid ID and returning error message when ID is invalid
  if (userInput < 1) {
    res.send('Invalid product ID');
    return;
  } else {
    productId = `P${userInput.padStart(3, '0')}`;
  }

  const productToBeReturned = dataService.getCombinedProductMap[productId];

  if (!productToBeReturned) {
    res.send('Product not found!');
  } else {
    res.send(productToBeReturned);
  }
});

// Getting all the products under a category based on category's ID
app.get('/category/:ctyId', (req, res) => {

  const userInput = req.params.ctyId;
  let categoryId;

  // Generating valid ID and returning error message when ID is invalid
  if (userInput < 1) {
    res.send('Invalid category ID');
    return;
  } else {
    categoryId = `cty${userInput.padStart(2, '0')}`;
  }

  const jsonObjectToBeReturned = {
    ctyId: categoryId,
    categoryName: dataService.getCategories[categoryId],
    products: {},
  };

  for (product of Object.values(dataService.getCombinedProductMap)) {
    if (product.categoryId === categoryId) {
      jsonObjectToBeReturned.products[product.id] = product;
    }
  }

  if (jsonObjectToBeReturned.products.size === 0) {
    res.send('Category not found!');
  } else {
    res.send(jsonObjectToBeReturned);
  }
});

app.get('/com', (req, res) => {
  res.send(dataService.getCombinedProductMap);
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
