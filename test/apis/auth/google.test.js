import request from 'supertest';
import app from '../../../src/app';

describe('GET /api/v2/auth/google', () => {
	describe('should redirect to Google Oauth and display accounts available for Oauth', () => {
		test('should respond with a 302 status code', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.statusCode).toBe(302);
		});
		test('response length should be 0', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.headers['content-length']).toBe('0');
		});
		test('should redirect to Google-Oauth (https://accounts.google.com/...)', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.redirect).toBe(true);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
	});
});
