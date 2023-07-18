import specmatic from 'specmatic'
import { getApp, startAppServer, stopAppServer } from './util/app.server.js'

const APP_HOST = 'localhost'
const APP_PORT = 8081

const KAFKA_BROKER_PORT = 9001
const HTTP_STUB_HOST = 'localhost'
const HTTP_STUB_PORT = 10002

process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1
process.env.KAFKA_BROKER_URL = `localhost:${KAFKA_BROKER_PORT}`
process.env.API_BASE_URL = `http://${HTTP_STUB_HOST}:${HTTP_STUB_PORT}`

let httpStub, kafkaMock, appServer

kafkaMock = await specmatic.startKafkaMock(KAFKA_BROKER_PORT)
httpStub = await specmatic.startHttpStub(HTTP_STUB_HOST, HTTP_STUB_PORT)
appServer = await startAppServer(APP_PORT)

await specmatic.setHttpStubExpectations('test-resources/products.json', httpStub.url)
await specmatic.setKafkaMockExpectations(kafkaMock, [{ topic: 'product-queries', count: 1 }])
await specmatic.testWithApiCoverage(getApp(), APP_HOST, APP_PORT)
specmatic.showTestResults(test)
const verificationResult = await specmatic.verifyKafkaMock(kafkaMock)

await stopAppServer(appServer)
await specmatic.stopHttpStub(httpStub)
await specmatic.stopKafkaMock(kafkaMock)

if (!verificationResult) {
    throw new Error('Specmatic kafka verification failed')
}
