//The below constants has to be at the top as require('../../src/app.js) will expect this on require itself
const KAFKA_BROKER_PORT = 9001;
process.env.KAFKA_BROKER_PORT = KAFKA_BROKER_PORT;
const HTTP_STUB_PORT = 10002;
process.env.API_PORT = HTTP_STUB_PORT;
const APP_HOST = 'localhost';
const APP_PORT = 8081;

const http = require('http');
const specmatic = require('specmatic');
const app = require('../../../src/app.js');

const startAppServer = () => {
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
    var httpStub, kafkaStub, appServer;
    kafkaStub = await specmatic.startKafkaStub(KAFKA_BROKER_PORT);
    httpStub = await specmatic.startStub('localhost', HTTP_STUB_PORT);
    await specmatic.setExpectations('test-resources/products.json', httpStub.url);
    appServer = await startAppServer();
    await specmatic.test(APP_HOST, APP_PORT);
    global.specmatic = { appServer, httpStub, kafkaStub };
};
