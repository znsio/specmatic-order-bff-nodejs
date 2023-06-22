const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Kafka } = require('kafkajs');

const kafkaBrokerPort = process.env.KAFKA_BROKER_PORT || 9092;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`127.0.0.1:${kafkaBrokerPort}`],
});

router.get('/findAvailableProducts', function (req, res) {
    axios
        .get('http://localhost:9000/products?type=' + req.query.type)
        .then(async apiRes => {
            const producer = kafka.producer();
            await producer.connect();
            for (const i in apiRes.data) {
                await producer.send({
                    topic: 'product-queries',
                    messages: [{ key: req.query.type, value: JSON.stringify(apiRes.data[i]) }],
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
        .then(apiRes => {
            res.send({ status: true });
        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.send({ status: false });
        });
});

module.exports = router;
