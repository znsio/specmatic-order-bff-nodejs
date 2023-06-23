const specmatic = require('specmatic');

const stopAppServer = (exitCode) => {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server');
        global.specmatic.appServer.close(err => {
            if (err) {
                console.error(`Stopping BFF failed with ${err}`);
                reject();
            } else {
                console.info('Stopped BFF server');
                resolve();
            }
            process.exit(exitCode);
        });
    });
};

console.log('after...');

async function verifyMessage() {
    const expectedMessage = JSON.stringify({ name: 'iPhone', inventory: 5, id: 2 });
    const verificationResult = await specmatic.verifyKafkaStub(global.specmatic.kafkaStub, 'product-queries', 'gadget', expectedMessage);
    if (!verificationResult) console.error(Error('Specmatic kafka verification failed'));
    return verificationResult;
}

module.exports = async function () {
    const verificationResult = await verifyMessage();
    specmatic.stopStub(global.specmatic.httpStub);
    specmatic.stopKafkaStub(global.specmatic.kafkaStub);
    await stopAppServer(verificationResult ? 0 : 1);
};
