const { startStub, stopStub } = require('specmatic');
const specmatic = require('specmatic');
var request = require('supertest');
var app = require('../src/app.js');

var server;

beforeAll(async () => {
    server = await startStub('localhost', '9000');
}, 10000);

test('Access api on stub server', done => {
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

test('Run contract tests', async () => {
    const result = await specmatic.test('resources/api_order_v1.yaml', 'localhost', '9000');
    expect(result).toBeFalsy();
}, 10000);

afterAll(() => {
    stopStub(server);
});
