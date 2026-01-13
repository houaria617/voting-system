const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

jest.setTimeout(60000);

describe('Results Visibility Logic', () => {

    let adminToken = '';
    let voterToken = '';

    let afterVotePollId = '';
    let closedPollId = '';

    beforeAll(async () => {
        // 1. Setup Users
        const adminEmail = `admin_res_${Date.now()}@test.com`;
        const resAdmin = await request(app).post('/api/auth/register').send({
            name: 'Admin', email: adminEmail, password: '123', role: 'ADMIN'
        });
        adminToken = resAdmin.body.token;

        const voterEmail = `voter_res_${Date.now()}@test.com`;
        const resVoter = await request(app).post('/api/auth/register').send({
            name: 'Voter', email: voterEmail, password: '123', role: 'VOTER'
        });
        voterToken = resVoter.body.token;

        // 2. Create 'AFTER_VOTE' Poll
        const poll1 = await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: "After Vote Poll", options: ["A", "B"],
                settings: { visibility: "AFTER_VOTE" }
            });
        afterVotePollId = poll1.body.poll.id;

        // 3. Create 'CLOSED' Poll
        // (Note: Visibility 'CLOSED' means results are hidden, not that voting is stopped.
        // Voting stopped is status='CLOSED')
        const poll2 = await request(app).post('/api/polls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: "Hidden Results Poll", options: ["X", "Y"],
                settings: { visibility: "CLOSED" }
            });
        closedPollId = poll2.body.poll.id;
    });

    // --------------------------------------------------------

    it('Should HIDE results for AFTER_VOTE poll if user hasn\'t voted', async () => {
        const res = await request(app)
            .get(`/api/polls/${afterVotePollId}`)
            .set('Authorization', `Bearer ${voterToken}`);

        expect(res.statusCode).toEqual(200);
        // The option object should NOT have 'vote_count_cache'
        expect(res.body.poll_options[0]).not.toHaveProperty('vote_count_cache');
        expect(res.body.user_has_voted).toBe(false);
    });

    it('Should SHOW results for AFTER_VOTE poll once user votes', async () => {
        // 1. Fetch to get Option ID
        const preRes = await request(app).get(`/api/polls/${afterVotePollId}`);
        const optionId = preRes.body.poll_options[0].id;

        // 2. Vote
        await request(app).post(`/api/polls/${afterVotePollId}/vote`)
            .set('Authorization', `Bearer ${voterToken}`)
            .send({ optionId });

        // 3. Fetch again
        const res = await request(app)
            .get(`/api/polls/${afterVotePollId}`)
            .set('Authorization', `Bearer ${voterToken}`);

        expect(res.statusCode).toEqual(200);
        // Now it SHOULD have the count
        expect(res.body.poll_options[0]).toHaveProperty('vote_count_cache');
        expect(res.body.user_has_voted).toBe(true);
    });

    it('Should ALWAYS SHOW results to the Creator (Admin)', async () => {
        const res = await request(app)
            .get(`/api/polls/${closedPollId}`)
            .set('Authorization', `Bearer ${adminToken}`); // Creator

        expect(res.statusCode).toEqual(200);
        expect(res.body.poll_options[0]).toHaveProperty('vote_count_cache');
    });

    it('Should HIDE results for CLOSED visibility (even if voted)', async () => {
        // 1. Fetch Option ID
        const preRes = await request(app).get(`/api/polls/${closedPollId}`);
        const optionId = preRes.body.poll_options[0].id;

        // 2. Vote
        await request(app).post(`/api/polls/${closedPollId}/vote`)
            .set('Authorization', `Bearer ${voterToken}`)
            .send({ optionId });

        // 3. Fetch
        const res = await request(app)
            .get(`/api/polls/${closedPollId}`)
            .set('Authorization', `Bearer ${voterToken}`);

        expect(res.body.poll_options[0]).not.toHaveProperty('vote_count_cache');
    });

});