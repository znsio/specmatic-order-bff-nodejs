const KAFKA_BROKER_PORT = 10001; //This has to be at the top as require('../../src/app.js) will expect this on require itself
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;
const specmatic = require('specmatic');
var request = require('supertest');
const app = require('../../src/app.js');

var kafkaStub;

beforeAll(async () => {
    kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT);
}, 20000);

test('New email registered in the system is asynchronously notified via kafka queue', async () => {
    const res = await request(app).get('/email?to=vikram@xnsio.com').accept('application/json').expect(200);
    expect(res.body.success).toBeTruthy();
    await expect(specmatic.verifyKafkaStub(kafkaStub, 'test-topic', '1234', 'vikram@xnsio.com')).resolves.toBeTruthy();
}, 20000);

test('New email registered in the system fails verification if data mismatches', async () => {
    const res = await request(app).get('/email?to=vikram@xnsio.com').accept('application/json').expect(200);
    expect(res.body.success).toBeTruthy();
    await expect(specmatic.verifyKafkaStub(kafkaStub, 'test-topic', '1234', 'jaydeep@xnsio.com')).resolves.toBeFalsy();
}, 20000);

afterAll(async () => {
    specmatic.stopKafkaStub(kafkaStub);
});
