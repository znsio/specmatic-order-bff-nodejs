const express = require('express')
const axios = require('axios')
const router = express.Router()
const { Kafka } = require('kafkajs')

const kafkaBrokerURL = process.env.KAFKA_BROKER_URL || "localhost:9092"
const domainAPIBaseURL = process.env.API_BASE_URL || "http://localhost:9000"

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${kafkaBrokerURL}`],
})

router.get('/findAvailableProducts', function (req, res) {
    axios
        .get(`${domainAPIBaseURL}/products?type=` + req.query.type)
        .then(async apiRes => {
            const producer = kafka.producer()
            await producer.connect()
            for (const i in apiRes.data) {
                const product = apiRes.data[i]
                await producer.send({
                    topic: 'product-queries',
                    messages: [{ value: JSON.stringify({id: product.id, name: product.name, inventory: product.inventory}) }],
                })
            }
            await producer.disconnect()
            await new Promise(r => setTimeout(r, 2000));
            res.send(apiRes.data)
        })
        .catch(err => console.log('Error: ', err.message))
})

router.post('/createOrder', function (req, res) {
    axios
        .post('${apiBaseURL}/orders', req.body)
        .then(() => {
            res.send({ status: true })
        })
        .catch(err => {
            console.log('Error: ', err.message)
            res.send({ status: false })
        })
})

module.exports = router
