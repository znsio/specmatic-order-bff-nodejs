const specmatic = require('specmatic');

console.log('after...');

module.exports = async function () {
    await specmatic.stopStub(global.specmatic.httpStub);
    await specmatic.stopKafkaStub(global.specmatic.kafkaStub);
};
