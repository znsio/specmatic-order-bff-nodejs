const { default: axios } = require("axios");
const { Kafka } = require("kafkajs");
const ApiError = require("./apiError");

const kafka = new Kafka({
  clientId: "specmatic-order-bff-nodejs",
  brokers: [process.env.KAFKA_BROKER_URL],
});
const kafkaProducer = kafka.producer();
const kafkaTopic = process.env.KAFKA_TOPIC;

const authHeader = {
  Authenticate: process.env.AUTHENTICATION,
};
const domainUrl = process.env.STUB_URL;
const orderEndpoints = {
  CREATE: "/orders",
};
const productEndpoints = {
  SEARCH: "/products",
  CREATE: "/products",
};

// PRODUCT ENDPOINTS
async function searchProducts(type) {
  try {
    const resp = await axios.get(`${domainUrl}${productEndpoints.SEARCH}${type ? `?type=${type}` : ""}`, { timeout: 3000 });
    const products = resp.data;
    const product = products[0];

    await kafkaProducer.connect();
    await kafkaProducer.send({
      topic: kafkaTopic,
      messages: [
        {
          value: JSON.stringify({
            id: product.id,
            name: product.name,
            inventory: product.inventory,
          }),
        },
      ],
    });
    await kafkaProducer.disconnect();

    return products;
  } catch (error) {
    throw ApiError.DomainError(error);
  }
}

async function createProduct(product) {
  try {
    const resp = await axios.post(`${domainUrl}${productEndpoints.CREATE}`, product, {
      headers: authHeader,
    });
    return resp.data;
  } catch (error) {
    throw ApiError.DomainError(error);
  }
}

// ORDER ENDPOINTS
async function createOrder(order) {
  order.status = "pending";
  try {
    const resp = await axios.post(`${domainUrl}${orderEndpoints.CREATE}`, order, {
      headers: authHeader,
    });
    return resp.data;
  } catch (error) {
    throw ApiError.DomainError(error);
  }
}

module.exports = {
  searchProducts,
  createProduct,
  createOrder,
};
