import request from 'supertest';
import app from '../../../src/app';

describe('GET /api/v2/auth/github', () => {
	describe('should redirect to GitHub Oauth and display accounts available for Oauth', () => {
		test('should respond with a 302 status code', async () => {
			const response = await request(app).get('/api/v2/auth/github');
			expect(response.statusCode).toBe(302);
		});
		test('response length should be 0', async () => {
			const response = await request(app).get('/api/v2/auth/github');
			expect(response.headers['content-length']).toBe('0');
		});
		test('should redirect to GitHub-Oauth (https://github.com/login/oauth/...)', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.redirect).toBe(true);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
	});
});
