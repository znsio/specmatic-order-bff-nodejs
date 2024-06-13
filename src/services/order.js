const domainServer = require("../domain");

function createOrder(data) {
  const response = domainServer.createOrder(data);
  return response;
}

module.exports = {
  createOrder,
};
