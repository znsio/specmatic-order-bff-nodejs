const KAFKA_BROKER_PORT = 10001; //This has to be at the top as require('../../src/app.js) will expect this on require itself
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;

const http = require('http');
const { setExpectations, stopStub, startStub, startKafkaStub, stopKafkaStub, verifyKafkaStub } = require('specmatic');
const specmatic = require('specmatic');
const app = require('../../src/app.js');

var stub, kafkaStub, server;

beforeAll(async () => {
    kafkaStub = await startKafkaStub(KAFKA_BROKER_PORT);
    stub = await startStub();
    server = await startServer();
    await setExpectations('test-resources/products.json', stub.url);
}, 10000);

test('asdsa', async () => {
    await specmatic.test('localhost', 8080, 'test-resources/product-search-bff-api.yaml');
    const value = JSON.stringify({ id: 2, name: 'iPhone', type: 'gadget', inventory: 5 });
    await expect(verifyKafkaStub(kafkaStub, 'product-queries', 'test', value)).resolves.toBeTruthy();
}, 5000);

afterAll(async () => {
    await stopServer();
    stopStub(stub);
    stopKafkaStub(kafkaStub);
});

function startServer() {
    return new Promise((resolve, _reject) => {
        const server = http.createServer(app);
        server.listen(8080);
        server.on('listening', async () => {
            console.log(`Running BFF server @ http://${server.address().address}:${server.address().port}`);
            resolve(server);
        });
    });
}

function stopServer() {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server');
        server.close(err => {
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
