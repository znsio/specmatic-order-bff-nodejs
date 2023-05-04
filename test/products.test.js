const { startStubServer } = require('specmatic');
var exec = require('child_process').exec;
var request = require('supertest');
var app = require('../src/app.js');

beforeAll(async () => {
    startStubServer('', '', 'localhost', 9000);
    await sleep(5000);
}, 10000);

test('Find Products', (done) => {
    request(app)
        .get('/findAvailableProducts?type=test')
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body)).toBeTruthy();
			expect(res.body.length).toEqual(1);
            done();
        });
});

afterAll(() => {
    exec('kill -9 $(lsof -t -i:9000)');
}, 2000);

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
