import specmatic from 'specmatic';
import http from 'http';

const APP_HOST = 'localhost';
const APP_PORT = 8081;

const appServer = await startAppServer();
await specmatic.test(APP_HOST, APP_PORT);
specmatic.showTestResults(test);
// const verificationResult = await verifyMessage();
const verificationResult = await verifyKafkaStub();
await stopAppServer(verificationResult ? 0 : 1);

function startAppServer() {
    return new Promise((resolve, _reject) => {
        import('../../src/app.js').then(app => {
            specmatic.enableApiCoverage(app.default);
            const server = http.createServer(app.default);
            server.listen(APP_PORT);
            server.on('listening', async () => {
                console.log(`Running BFF server @ http://${server.address().address}:${server.address().port}`);
                resolve(server);
            });
        });
    });
}

function stopAppServer(exitCode) {
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

async function verifyMessage() {
    const expectedMessage = JSON.stringify({ name: 'iPhone', inventory: 5, id: 2 });
    const verificationResult = await specmatic.verifyKafkaStubMessage(global.specmatic.kafkaStub, 'product-queries', expectedMessage);
    if (!verificationResult) console.error(Error('Specmatic kafka message verification failed'));
    return verificationResult;
}

async function verifyKafkaStub() {
    const verificationResult = await specmatic.verifyKafkaStub(global.specmatic.kafkaStub);
    if (!verificationResult) console.error(Error('Specmatic kafka verification failed'));
    return verificationResult;
}
