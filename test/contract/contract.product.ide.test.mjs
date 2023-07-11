import specmatic from 'specmatic'
import { startAppServer, stopAppServer } from './app.server.util.js'

const APP_HOST = 'localhost'
const APP_PORT = 8081

const KAFKA_BROKER_PORT = 9001
const HTTP_STUB_HOST = 'localhost'
const HTTP_STUB_PORT = 10002

process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1
process.env.KAFKA_BROKER_URL = `localhost:${KAFKA_BROKER_PORT}`
process.env.API_BASE_URL = `http://${HTTP_STUB_HOST}:${HTTP_STUB_PORT}`

let httpStub, kafkaStub

kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT)
httpStub = await specmatic.startStub(HTTP_STUB_HOST, HTTP_STUB_PORT)
const appServer = await startAppServer(APP_PORT)

await specmatic.setExpectations('test-resources/products.json', httpStub.url)
await specmatic.setKafkaStubExpectations(kafkaStub, [{ topic: 'product-queries', count: 1 }])
await specmatic.test(APP_HOST, APP_PORT)
specmatic.showTestResults(test)
const verificationResult = await specmatic.verifyKafkaStub(kafkaStub)

await stopAppServer(appServer)
await specmatic.stopStub(httpStub)
await specmatic.stopKafkaStub(kafkaStub)

if (!verificationResult) {
    throw new Error('Specmatic kafka verification failed')
}
