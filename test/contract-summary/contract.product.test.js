//The below constants has to be at the top as require('../../src/app.js) will expect this on require itself
const KAFKA_BROKER_PORT = 10001;
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;
const APP_HOST = 'localhost';
const APP_PORT = 8080;

const http = require('http');
const app = require('../../src/app.js');
const specmatic = require('specmatic');

var httpStub, kafkaStub, appServer;

beforeAll(async () => {
    kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT);
    httpStub = await specmatic.startStub();
    appServer = await startApp();
    await specmatic.setExpectations('test-resources/products.json', httpStub.url);
}, 10000);

test('Contract test product search', async () => {
    await specmatic.test(APP_HOST, APP_PORT);
    const value = JSON.stringify({ id: 2, name: 'iPhone', type: 'gadget', inventory: 5 });
    await expect(specmatic.verifyKafkaStub(kafkaStub, 'product-queries', 'test', value)).resolves.toBeTruthy();
}, 5000);

afterAll(async () => {
    await stopApp();
    specmatic.stopStub(httpStub);
    specmatic.stopKafkaStub(kafkaStub);
});

function startApp() {
    return new Promise((resolve, _reject) => {
        appServer = http.createServer(app);
        appServer.listen(APP_PORT);
        appServer.on('listening', async () => {
            console.log(`Running BFF server @ http://${appServer.address().address}:${appServer.address().port}`);
            resolve(appServer);
        });
    });
}

function stopApp() {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server');
        appServer.close(err => {
            if (err) {
                console.error(`Stopping BFF failed with ${err}`);
                reject();
            } else {
                console.info('Stopped BFF server');
                resolve();
            }
        });
    });
}
