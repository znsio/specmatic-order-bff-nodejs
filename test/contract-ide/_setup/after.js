const specmatic = require('specmatic');

const stopAppServer = () => {
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
            process.exit(0);
        });
    });
};

console.log('after...');

async function verifyMessage() {
    const expectedMessage = JSON.stringify({ name: 'iPhone', inventory: '5', id: 2 });
    const verificationResult = await specmatic.verifyKafkaStub(global.specmatic.kafkaStub, 'product-queries', 'gadget', expectedMessage);
    console.error(Error('Specmatic kafka verification failed'));
}

module.exports = async function () {
    await verifyMessage();
    specmatic.stopStub(global.specmatic.httpStub);
    specmatic.stopKafkaStub(global.specmatic.kafkaStub);
    await stopAppServer();
};
