const specmatic = require('specmatic');

const stopServer = () => {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server');
        global.specmatic.server.close((err) => {
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

module.exports = async function () {
    const value = JSON.stringify({ id: 2, name: 'iPhone', type: 'gadget', inventory: 5 });
    const verifyResult = await specmatic.verifyKafkaStub(global.specmatic.kafkaStub, 'product-queries', 'test', value);
    if (!verifyResult) throw Error('Specmatic kafka verification failed');
    specmatic.stopStub(global.specmatic.stub);
    specmatic.stopKafkaStub(global.specmatic.kafkaStub);
    await stopServer();
};
