const KAFKA_BROKER_PORT = 10001; //This has to be at the top as require('../../src/app.js) will expect this on require itself
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;

const http = require('http');
const specmatic = require('specmatic');
const app = require('../../../src/app.js');

const startServer = () => {
    return new Promise((resolve, _reject) => {
        const server = http.createServer(app);
        server.listen(8080);
        server.on('listening', async () => {
            console.log(`Running BFF server @ http://${server.address().address}:${server.address().port}`);
            resolve(server);
        });
    });
};

console.log('before...');

module.exports = async function () {
    var stub, kafkaStub, server;
    kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT);
    stub = await specmatic.startStub();
    await specmatic.setExpectations('test-resources/products.json');
    server = await startServer();
    await specmatic.test('localhost', 8080, 'test-resources/product-search-bff-api.yaml');
    global.specmatic = { server, stub, kafkaStub };
};
