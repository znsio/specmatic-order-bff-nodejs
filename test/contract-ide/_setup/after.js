const specmatic = require('specmatic')

console.log('about to start test tear down...')

module.exports = async function () {
    await specmatic.stopStub(global.specmatic.httpStub)
    await specmatic.stopKafkaStub(global.specmatic.kafkaStub)
}
