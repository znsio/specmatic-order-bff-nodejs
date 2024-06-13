const domainServer = require("../domain");

async function createProduct(product) {
  return await domainServer.createProduct(product);
}

async function searchProducts(type) {
  return domainServer.searchProducts(type);
}

module.exports = {
  createProduct,
  searchProducts,
};
