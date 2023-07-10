import specmatic from 'specmatic'
import http from 'http'

const APP_HOST = 'localhost'
const APP_PORT = 8081

const appServer = await startAppServer()
await specmatic.test(APP_HOST, APP_PORT)
specmatic.showTestResults(test)
await stopAppServer()
await verifyKafkaStub()

function startAppServer() {
    return new Promise((resolve, _reject) => {
        import('../../src/app.js').then(app => {
            const server = http.createServer(app.default)
            server.listen(APP_PORT)
            server.on('listening', async () => {
                console.log(`Running BFF server @ http://${server.address().address}:${server.address().port}`)
                resolve(server)
            })
        })
    })
}

function stopAppServer() {
    return new Promise((resolve, reject) => {
        console.debug('Stopping BFF server')
        appServer.close(err => {
            if (err) {
                console.error(`Stopping BFF failed with ${err}`)
                reject()
            } else {
                console.info('Stopped BFF server')
                resolve()
            }
        })
    })
}

async function verifyKafkaStub() {
    const verificationResult = await specmatic.verifyKafkaStub(global.specmatic.kafkaStub)
    if (!verificationResult) {
        throw new Error('Specmatic kafka verification failed')
    }
}
