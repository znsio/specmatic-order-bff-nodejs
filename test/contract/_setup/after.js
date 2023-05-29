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
        });
    });
};

console.log('after...');

module.exports = async function () {
    specmatic.stopStub(global.specmatic.stub);
    await stopServer();
};
