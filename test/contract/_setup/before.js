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
    var stub, server;
    stub = await specmatic.startStub();
    await specmatic.setExpectations('test-resources/products.json');
    server = await startServer();
    await specmatic.test('localhost', 8080, 'test-resources/product-search-bff-api.yaml');
    global.specmatic = { server, stub };
};
