//The below constants has to be at the top as require('../../src/app.js) will expect this on require itself
const KAFKA_BROKER_PORT = 9001;
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;
const APP_HOST = 'localhost';
const APP_PORT = 8081;

const http = require('http');
const specmatic = require('specmatic');
const app = require('../../../src/app.js');

const startServer = () => {
    return new Promise((resolve, _reject) => {
        const server = http.createServer(app);
        server.listen(APP_PORT);
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
    await specmatic.test(APP_HOST, APP_PORT);
    global.specmatic = { server, stub, kafkaStub };
};
