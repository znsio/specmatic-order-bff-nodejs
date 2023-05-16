const { startStub, stopStub, setExpectations } = require('specmatic');
const specmatic = require('specmatic');
var request = require('supertest');
var app = require('../src/app.js');
var http = require('http');

app.set('port', 8080);

var stub;

beforeAll(async () => {
    stub = await startStub();
    await setExpectations('resources/data/products.json');
}, 10000);

test('Single end point', done => {
    request(app)
        .get('/findAvailableProducts?type=test')
        .accept('application/json')
        .expect(200)
        .then(res => {
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toEqual(1);
            done();
        });
}, 5000);

test('Run contract tests', function (done) {
    const server = http.createServer(app);
    server.listen(8080);
    server.on('listening', async () => {
        console.log(server.address());
        const result = await specmatic.test('localhost', 8080);
        expect(result).toBeTruthy();
        server.close(() => {
            done();
        });
    });
}, 10000);

afterAll(() => {
    stopStub(stub);
});
