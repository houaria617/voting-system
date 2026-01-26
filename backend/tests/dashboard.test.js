const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

// Increase timeout for Supabase latency
jest.setTimeout(30000);

describe('Dashboard & Search Tests', () => {

    let adminToken = '';
    let otherUserToken = '';

    // Unique emails to avoid collisions
    const adminEmail = `admin_dash_${Date.now()}@test.com`;
    const otherEmail = `other_dash_${Date.now()}@test.com`;

    // 1. SETUP: Create Users and Polls
    beforeAll(async () => {
        // A. Register Admin (The main user)
        const resAdmin = await request(app).post('/api/auth/register').send({
            name: 'Admin', email: adminEmail, password: '123', role: 'ADMIN'
        });
        adminToken = resAdmin.body.token;

        // B. Register Other User (To test data isolation)
        const resOther = await request(app).post('/api/auth/register').send({
            name: 'Other', email: otherEmail, password: '123', role: 'ADMIN'
        });
        otherUserToken = resOther.body.token;

        // C. Create Polls as Admin
        await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: "React vs Vue", options: ["React", "Vue"] });

        await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: "Angular vs Svelte", options: ["Angular", "Svelte"] });

        // D. Create Poll as Other User (Should NOT appear in Admin's dashboard)
        await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${otherUserToken}`)
            .send({ title: "Other User Poll", options: ["A", "B"] });
    });

    // 2. TEST: View Dashboard
    it('Should return ALL polls created by the logged-in user', async () => {
        const res = await request(app)
            .get('/api/polls/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);

        // Admin created 2 polls. "Other User Poll" should NOT be here.
        expect(res.body.count).toEqual(2);

        // Verify structure
        expect(Array.isArray(res.body.polls)).toBe(true);
        expect(res.body.polls[0]).toHaveProperty('title');
    });

    // 3. TEST: Search Functionality
    it('Should SEARCH polls by title', async () => {
        const res = await request(app)
            .get('/api/polls/dashboard?search=Vue') // Searching for "Vue"
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toEqual(1);
        expect(res.body.polls[0].title).toEqual("React vs Vue");
    });

    // 4. TEST: Empty Search Result
    it('Should return empty list if search matches nothing', async () => {
        const res = await request(app)
            .get('/api/polls/dashboard?search=Pizza')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toEqual(0);
        expect(res.body.polls).toEqual([]);
    });

});