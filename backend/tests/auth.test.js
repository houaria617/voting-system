const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

const randomEmail = `tester_${Date.now()}@example.com`;
let userToken = '';

describe('Auth System Integration Tests', () => {

    // ✅ FIX: Increase timeout to 30 seconds (30000 ms)
    // This gives Supabase enough time to respond over a slow network.
    jest.setTimeout(30000);

    // 1. REGISTER
    it('POST /api/auth/register - Should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jest Tester',
                email: randomEmail,
                password: 'Password123!',
                role: 'VOTER'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toEqual(randomEmail);
    });

    // 2. LOGIN
    it('POST /api/auth/login - Should login and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: randomEmail,
                password: 'Password123!'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        userToken = res.body.token;
    });

    // 3. LOGOUT (Success)
    it('POST /api/auth/logout - Should blacklist the token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Logged out successfully');
    });

    // 4. LOGOUT AGAIN (Fail - Access Denied)
    it('POST /api/auth/logout - Should reject blacklisted token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.statusCode).toEqual(401);
    });

    // 5. FORGOT PASSWORD
    it('POST /api/auth/forgot-password - Should send email/response', async () => {
        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: randomEmail });

        expect(res.statusCode).toEqual(200);
    });
});