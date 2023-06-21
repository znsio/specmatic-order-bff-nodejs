const specmatic = require('specmatic');
var request = require('supertest');
const app = require('../../src/app.js');

var kafkaStub;

beforeAll(async () => {
    kafkaStub = await specmatic.startKafkaStub();
}, 20000);

test('Kafka stub verification works!!!!', async () => {
    const res = await request(app).get('/email?to=vikram@xnsio.com').accept('application/json').expect(200);
    expect(res.body.success).toBeTruthy();
    await expect(specmatic.verifyKafkaStub(kafkaStub, 'test-topic', '1234', 'vikram@xnsio.com')).resolves.toBeTruthy();
}, 20000);

afterAll(async () => {
    specmatic.stopKafkaStub(kafkaStub);
});
