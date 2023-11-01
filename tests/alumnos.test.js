const app = require('../app');
const request = require('supertest');

describe('GET /task', () => {

    test('debería responder código 200', async () => {
        const response = await request(app).get('/task').send();
        expect(response.statusCode).toBe(404);
    })
})