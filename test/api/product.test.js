const { setExpectations, stopStub, startStub } = require('specmatic');
var request = require('supertest');
var app = require('../../src/app.js');
var stub;

beforeAll(async () => {
    stub = await startStub();
    await setExpectations('test-resources/products.json', stub.url);
}, 10000);

test('findAvailableProducts gives a list of products', done => {
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

afterAll(() => {
    stopStub(stub);
});
