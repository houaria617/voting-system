const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

jest.setTimeout(30000);

describe('Edit Poll Functionality', () => {

    let adminToken = '';
    let intruderToken = '';
    let pollId = '';

    const adminEmail = `creator_edit_${Date.now()}@test.com`;
    const intruderEmail = `intruder_edit_${Date.now()}@test.com`;

    // 1. SETUP
    beforeAll(async () => {
        // A. Register Creator (Admin)
        const resAdmin = await request(app).post('/api/auth/register').send({
            name: 'Creator', email: adminEmail, password: '123', role: 'ADMIN'
        });
        adminToken = resAdmin.body.token;

        // B. Register Intruder (Another User)
        const resIntruder = await request(app).post('/api/auth/register').send({
            name: 'Intruder', email: intruderEmail, password: '123', role: 'ADMIN'
        });
        intruderToken = resIntruder.body.token;

        // C. Create a Poll (Active)
        const poll = await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: "Original Title",
                options: ["A", "B"],
                theme: { "color": "blue" }
            });
        pollId = poll.body.poll.id;
    });

    // 2. SUCCESS CASE
    it('Should allow Creator to update Title and Theme', async () => {
        const res = await request(app)
            .put(`/api/polls/${pollId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: "Updated Title",
                theme: { "color": "red" } // Changing color
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.poll.title).toEqual("Updated Title");
        expect(res.body.poll.theme_settings.color).toEqual("red");
    });

    // 3. SECURITY CASE
    it('Should PREVENT another user from editing the poll', async () => {
        const res = await request(app)
            .put(`/api/polls/${pollId}`)
            .set('Authorization', `Bearer ${intruderToken}`) // Wrong token
            .send({ title: "Hacked Title" });

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toMatch(/authorized/);
    });

    // 4. LOGIC CASE: CLOSING
    it('Should allow Creator to CLOSE the poll', async () => {
        const res = await request(app)
            .put(`/api/polls/${pollId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: "CLOSED" });

        expect(res.statusCode).toEqual(200);
        expect(res.body.poll.status).toEqual("CLOSED");
    });

    // 5. LOGIC CASE: EDITING CLOSED POLL
    it('Should PREVENT editing if the poll is already CLOSED', async () => {
        const res = await request(app)
            .put(`/api/polls/${pollId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: "Trying to change closed poll" });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/cannot edit/i);
    });

});