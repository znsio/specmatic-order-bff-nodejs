const specmatic = require('specmatic');

const stopServer = () => {
    return new Promise((resolve, _reject) => {
        global.specmatic.server.close(() => {
            console.log('Stopping BFF server');
            resolve();
        });
    });
};

console.log('after...');

module.exports = async function () {
    //This should also return a promise
    specmatic.stopStub(global.specmatic.stub);
    await stopServer();
};
