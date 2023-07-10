//The below constants has to be at the top as require('../../src/app.js) will expect this on require itself
const KAFKA_BROKER_PORT = 10001
process.env.KAFKAJS_NO_PARTITIONER_WARNING=1
process.env.KAFKA_BROKER_URL = `localhost:${KAFKA_BROKER_PORT}`
const HTTP_STUB_HOST = "localhost"
const HTTP_STUB_PORT = 10002
process.env.API_BASE_URL = `http://${HTTP_STUB_HOST}:${HTTP_STUB_PORT}`
const APP_HOST = 'localhost'
const APP_PORT = 8080

const http = require('http')
const specmatic = require('specmatic')

let httpStub, kafkaStub, appServer

beforeAll(async () => {
    kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT)
    httpStub = await specmatic.startStub(HTTP_STUB_HOST, HTTP_STUB_PORT)
    appServer = await startApp()
}, 25000)

test('contract test', async () => {
    await specmatic.setExpectations('test-resources/products.json', httpStub.url)
    await specmatic.setKafkaStubExpectations(kafkaStub, [{ topic: 'product-queries', count: 1 }])
    await specmatic.test(APP_HOST, APP_PORT)
    await expect(specmatic.verifyKafkaStub(kafkaStub)).resolves.toBeTruthy()
}, 25000)

afterAll(async () => {
    await stopApp()
    await specmatic.stopStub(httpStub)
    await specmatic.stopKafkaStub(kafkaStub)
}, 25000)

function startApp() {
    process.env.API_PORT = httpStub.port
    const app = require('../../src/app.js')
    return new Promise((resolve, _reject) => {
        appServer = http.createServer(app)
        appServer.listen(APP_PORT)
        appServer.on('listening', async () => {
            console.log(`Running BFF server @ http://${appServer.address().address}:${appServer.address().port}`)
            resolve(appServer)
        })
    })
}

function stopApp() {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server')
        appServer.close(err => {
            if (err) {
                console.error(`Stopping BFF failed with ${err}`)
                reject()
            } else {
                console.info('Stopped BFF server')
                resolve()
            }
        })
    })
}
