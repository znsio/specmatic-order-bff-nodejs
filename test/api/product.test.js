const KAFKA_BROKER_PORT = 10001

//This has to be at the top as require('../../src/app.js) will expect this on require itself
process.env.KAFKA_BROKER_URL = `localhost:${KAFKA_BROKER_PORT}`
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1

const specmatic = require('specmatic')
const request = require('supertest')
const app = require('../../src/app.js')

let httpStub, kafkaMock

beforeAll(async () => {
    kafkaMock = await specmatic.startKafkaMock(KAFKA_BROKER_PORT)
    httpStub = await specmatic.startHttpStub()
    await specmatic.setHttpStubExpectations('test-resources/products.json', httpStub.url)
    await specmatic.setKafkaMockExpectations(kafkaMock, [{ topic: 'product-queries', count: 1 }])
}, 50000)

test('findAvailableProducts gives a list of products', async () => {
    const res = await request(app).get('/findAvailableProducts?type=gadget').accept('application/json').expect(200)
    const fileContent = readJsonFile('test-resources/products.json')
    let stubBody = fileContent['http-response'].body
    expect(res.body).toStrictEqual(stubBody)
    const { type, ...message } = stubBody[0]
    await expect(specmatic.verifyKafkaStubMessage(kafkaMock, 'product-queries', JSON.stringify(message))).resolves.toBeTruthy()
    await expect(specmatic.verifyKafkaStub(kafkaMock)).resolves.toBeTruthy()
}, 50000)

afterAll(async () => {
    await specmatic.stopStub(httpStub)
    await specmatic.stopKafkaStub(kafkaMock)
}, 50000)

function readJsonFile(stubDataFile) {
    const fs = require('fs')
    const data = fs.readFileSync(stubDataFile, 'utf8')
    return JSON.parse(data)
}
