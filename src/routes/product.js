const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Kafka } = require('kafkajs');

const kafkaBrokerPort = process.env.KAFKA_BROKER_PORT || 9092;
const apiPort = process.env.API_PORT || 9000;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`127.0.0.1:${kafkaBrokerPort}`],
});

router.get('/findAvailableProducts', function (req, res) {
    axios
        .get(`http://localhost:${apiPort}/products?type=` + req.query.type)
        .then(async apiRes => {
            const producer = kafka.producer();
            await producer.connect();
            for (const i in apiRes.data) {
                const product = apiRes.data[i];
                await producer.send({
                    topic: 'product-queries',
                    messages: [{ value: JSON.stringify({name: product.name, inventory: product.inventory, id: product.id}) }],
                });
            }
            await producer.disconnect();
            res.send(apiRes.data);
        })
        .catch(err => console.log('Error: ', err.message));
});

router.post('/createOrder', function (req, res, next) {
    axios
        .post('http://localhost:9000/orders', req.body)
        .then(() => {
            res.send({ status: true });
        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.send({ status: false });
        });
});

module.exports = router;
