import request from 'supertest';
import app from '../../../src/app';

describe('GET /api/v2/auth/google/callback', () => {
	describe('should return with user data and null status code', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
	});
});
