const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

// We need a long timeout because of the Supabase network latency 
jest.setTimeout(30000);

describe('Poll System Integration Tests', () => {

    // We need these variables to share data between steps
    let validToken = '';
    let createdPollId = '';
    const randomEmail = `poll_tester_${Date.now()}@example.com`;

    // ---------------------------------------------------------
    // SETUP: Create a User to get a Token (Authentication)
    // ---------------------------------------------------------
    // tests/poll.test.js

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Poll Admin',     // <-- Update name (optional)
                email: randomEmail,
                password: 'password123',
                role: 'ADMIN'
            });

        validToken = res.body.token;
        console.log("✅ Setup: Got valid ADMIN token");
    });

    // ---------------------------------------------------------
    // TEST CASE 1: PRIVACY / SECURITY
    // ---------------------------------------------------------
    it('Should BLOCK poll creation if user is not logged in', async () => {
        const res = await request(app)
            .post('/api/polls')
            .send({
                title: "Hacker Poll",
                options: ["A", "B"]
            });

        // Expect 401 Unauthorized because we didn't send the token
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toMatch(/no token|invalid|provided/i);
    });

    // ---------------------------------------------------------
    // TEST CASE 2: VALIDATION (Bad Inputs)
    // ---------------------------------------------------------
    it('Should REJECT poll with missing title', async () => {
        const res = await request(app)
            .post('/api/polls')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "", // Empty
                options: ["Option 1", "Option 2"]
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Title is required');
    });

    it('Should REJECT poll with less than 2 options', async () => {
        const res = await request(app)
            .post('/api/polls')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Bad Poll",
                options: ["Only One Option"] // Need at least 2
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('at least 2 options');
    });

    // ---------------------------------------------------------
    // TEST CASE 3: SUCCESSFUL CREATION (Complex Data)
    // ---------------------------------------------------------
    it('Should CREATE a poll with Theme and Settings successfully', async () => {
        const pollData = {
            title: "Best Coding Snack?",
            description: "Be honest.",
            options: ["Coffee", "Tea", "Energy Drink", "Water"],
            theme: {
                backgroundColor: "#000000",
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

        // Check Response Structure
        expect(res.body).toHaveProperty('poll');
        expect(res.body).toHaveProperty('share');
        expect(res.body.poll.title).toEqual(pollData.title);

        // Verify JSONB Theme was saved
        expect(res.body.poll.theme_settings).toHaveProperty('font', 'Roboto');

        // Save ID for the next test
        createdPollId = res.body.poll.id;
    });

    // ---------------------------------------------------------
    // TEST CASE 4: PUBLIC ACCESS (Get Poll)
    // ---------------------------------------------------------
    it('Should FETCH the poll details publicly (No Token needed)', async () => {
        // Notice: We are NOT sending .set('Authorization') here
        // This proves the route is public
        const res = await request(app)
            .get(`/api/polls/${createdPollId}`);

        expect(res.statusCode).toEqual(200);

        // Check if options were joined correctly
        expect(res.body.title).toEqual("Best Coding Snack?");
        expect(res.body.poll_options).toHaveLength(4); // We sent 4 options
        expect(res.body.poll_options[0]).toHaveProperty('option_text');
    });

    // ---------------------------------------------------------
    // TEST CASE 5: NOT FOUND
    // ---------------------------------------------------------
    it('Should return 404 for a non-existent poll', async () => {
        const res = await request(app)
            .get('/api/polls/9999999'); // Invalid ID

        expect(res.statusCode).toEqual(404);
    });

});