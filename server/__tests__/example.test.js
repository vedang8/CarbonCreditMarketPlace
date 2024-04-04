const request = require('supertest');
const { app, server } = require('../app'); // Assuming your Express app is exported from 'app.js' or similar

describe('GET /validuser', () => {
  it('responds with a valid user when authenticated', async () => {
    // Simulate an authenticated request with a valid JWT token
    const response = await request(app)
      .get('/validuser')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjA4MGFmMWQ3MGY3NGRjYmEwNjhjZmIiLCJpYXQiOjE3MTE4MDU0ODUsImV4cCI6MTcxMTg5MTg4NX0.nKXPkk-f-JbR46SHsOJk-DKZPWwZtP4gyjrwsznhzj8`)
      .expect('Content-Type', /json/)
      .expect(201); // Expecting a 201 status code for successful authentication

    // Verify the response body
    expect(response.body.status).toBe(201);
    expect(response.body.ValidUserOne).toBeDefined();
  });

  it('responds with a 401 error when not authenticated', async () => {
    // Simulate an unauthenticated request without a JWT token
    const response = await request(app)
      .get('/validuser')
      .expect('Content-Type', /json/)
      .expect(401); // Expecting a 401 status code for unauthorized access

    // Verify the response body
    expect(response.body.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });
});
