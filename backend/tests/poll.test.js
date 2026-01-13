const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

jest.setTimeout(30000);

describe('Poll System Integration Tests', () => {

    let validToken = '';
    let createdPollId = '';
    const randomEmail = `poll_tester_${Date.now()}@example.com`;

    // SETUP
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Poll Admin',
                email: randomEmail,
                password: 'password123',
                role: 'ADMIN'
            });

        validToken = res.body.token;
        console.log("✅ Setup: Got valid ADMIN token");
    });

    // TEST 1: SECURITY
    it('Should BLOCK poll creation if user is not logged in', async () => {
        const res = await request(app)
            .post('/api/polls')
            .send({ title: "Hacker Poll", options: ["A", "B"] });

        expect(res.statusCode).toEqual(401);
    });

    // TEST 2: VALIDATION
    it('Should REJECT poll with missing title', async () => {
        const res = await request(app)
            .post('/api/polls')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ title: "", options: ["Option 1", "Option 2"] });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Title is required');
    });

    // ---------------------------------------------------------
    // TEST CASE 3: SUCCESSFUL CREATION (Dates + Themes)
    // ---------------------------------------------------------
    it('Should CREATE a poll with Dates and Custom Theme', async () => {
        const startDate = new Date().toISOString();
        const endDate = new Date(Date.now() + 86400000).toISOString(); // +1 Day

        const pollData = {
            title: "Themed & Dated Poll",
            description: "Testing DB Storage",
            options: ["Red", "Blue"],
            startDate: startDate,
            endDate: endDate,
            theme: {
                backgroundColor: "#FF0000",
                textColor: "#FFFFFF",
                font: "Roboto"
            },
            settings: {
                isAnonymous: true,
                visibility: "ALWAYS"
            }
        };

        const res = await request(app)
            .post('/api/polls')
            .set('Authorization', `Bearer ${validToken}`)
            .send(pollData);

        expect(res.statusCode).toEqual(201);

        // --- DATE FIX: Handle Timezone Differences ---
        const returnedStart = new Date(res.body.poll.start_time).getTime();
        const returnedEnd = new Date(res.body.poll.end_time).getTime();
        const expectedStart = new Date(startDate).getTime();
        const expectedEnd = new Date(endDate).getTime();

        // Check difference. If it is less than 1 hour + 5 seconds (3605000ms), it is valid.
        const diffStart = Math.abs(returnedStart - expectedStart);
        expect(diffStart).toBeLessThanOrEqual(3605000);

        const diffEnd = Math.abs(returnedEnd - expectedEnd);
        expect(diffEnd).toBeLessThanOrEqual(3605000);
        // -------------------------------------------------------

        expect(res.body.poll.theme_settings).toHaveProperty('backgroundColor', '#FF0000');

        // Crucial: Set the ID so the next test doesn't fail with 404
        createdPollId = res.body.poll.id;
    });

    // TEST 4: DATA PERSISTENCE
    it('Should FETCH the poll and see the Theme/Dates', async () => {
        const res = await request(app)
            .get(`/api/polls/${createdPollId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("Themed & Dated Poll");
        expect(res.body.theme_settings.backgroundColor).toEqual("#FF0000");
    });

    // TEST 5: NOT FOUND
    it('Should return 404 for a non-existent poll', async () => {
        const res = await request(app)
            .get('/api/polls/9999999');

        expect(res.statusCode).toEqual(404);
    });

});