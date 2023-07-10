const specmatic = require('specmatic')

const KAFKA_BROKER_PORT = 9001
const HTTP_STUB_HOST = "localhost"
const HTTP_STUB_PORT = 10002

process.env.KAFKAJS_NO_PARTITIONER_WARNING=1
process.env.KAFKA_BROKER_URL = `localhost:${KAFKA_BROKER_PORT}`
process.env.API_BASE_URL = `http://${HTTP_STUB_HOST}:${HTTP_STUB_PORT}`

console.log('about to start test set up...')

module.exports = async function () {
    let httpStub, kafkaStub
    try {
        kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT)
        httpStub = await specmatic.startStub(HTTP_STUB_HOST, HTTP_STUB_PORT)
        await specmatic.setExpectations('test-resources/products.json', httpStub.url)
        await specmatic.setKafkaStubExpectations(kafkaStub, [{ topic: 'product-queries', count: 1 }])
    } catch (e) {
        await specmatic.stopKafkaStub(kafkaStub)
        await specmatic.stopStub(httpStub)
        process.exit(1)
    }
    global.specmatic = { httpStub, kafkaStub }
}
