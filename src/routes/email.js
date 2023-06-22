const express = require('express');
const { Kafka } = require('kafkajs');

const kafkaBrokerPort = process.env.KAFKA_BROKER_PORT || 9092;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`127.0.0.1:${kafkaBrokerPort}`],
});

const router = express.Router();

router.get('/', async function (req, res) {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: 'test-topic',
        messages: [{ key: '1234', value: req.query.to }],
    });
    await producer.disconnect();
    res.send({ success: true });
});

module.exports = router;
